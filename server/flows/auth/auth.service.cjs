const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

class AuthService {
  // Hash password
  static async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate access token
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Generate refresh token
  static generateRefreshToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }

  // Register new user
  static async register(userData) {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    });

    if (existingUser) {
      throw new Error(
        existingUser.email === userData.email
          ? 'Email already registered'
          : 'Username already taken'
      );
    }

    // Extract GitHub username if URL provided
    let githubUsername;
    if (userData.githubUrl) {
      const match = userData.githubUrl.match(/github\.com\/([^\/]+)/);
      githubUsername = match ? match[1] : undefined;
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        username: userData.username,
        displayName: userData.displayName,
        userType: userData.userType,
        githubUrl: userData.githubUrl,
        githubUsername,
        emailVerified: true, // Set to true by default for now
        failedLoginAttempts: 0,
        accountLocked: false,
      }
    });

    // Generate tokens
    const accessToken = this.generateAccessToken({
      userId: user.id,
      role: user.role
    });

    const refreshToken = this.generateRefreshToken(user.id);

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        userType: user.userType,
        role: user.role,
        githubUrl: user.githubUrl,
        githubUsername: user.githubUsername,
      },
      accessToken,
      refreshToken
    };
  }

  // Login user
  static async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    if (user.accountLocked) {
      if (user.lockUntil && user.lockUntil > new Date()) {
        throw new Error('Account is locked. Please try again later or reset your password.');
      }
      // If lock period has expired, unlock the account
      await prisma.user.update({
        where: { id: user.id },
        data: {
          accountLocked: false,
          lockUntil: null,
          failedLoginAttempts: 0
        }
      });
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      // Increment failed attempts
      const newAttempts = (user.failedLoginAttempts || 0) + 1;
      const shouldLock = newAttempts >= 5;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          accountLocked: shouldLock,
          lockUntil: shouldLock ? new Date(Date.now() + 30 * 60 * 1000) : null // 30 minutes
        }
      });

      throw new Error('Invalid credentials');
    }

    // Email verification check removed temporarily
    // if (!user.emailVerified) {
    //   throw new Error('Please verify your email before logging in');
    // }

    // Reset failed attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lastLogin: new Date()
      }
    });

    // Generate tokens
    const accessToken = this.generateAccessToken({
      userId: user.id,
      role: user.role
    });

    const refreshToken = this.generateRefreshToken(user.id);

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        userType: user.userType,
        role: user.role,
        githubUrl: user.githubUrl,
        githubUsername: user.githubUsername,
      },
      accessToken,
      refreshToken
    };
  }

  // Refresh token
  static async refreshToken(token) {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: token,
        refreshTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new tokens
    const accessToken = this.generateAccessToken({
      userId: user.id,
      role: user.role
    });

    const refreshToken = this.generateRefreshToken(user.id);

    // Update refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return {
      accessToken,
      refreshToken
    };
  }

  // Logout user
  static async logout(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpiry: null,
        sessions: null
      }
    });
  }
}

module.exports = { AuthService }; 