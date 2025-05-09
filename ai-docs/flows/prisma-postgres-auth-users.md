# Prisma + PostgreSQL + Authentication Setup Guide

## Overview

This guide provides a step-by-step approach to setting up a secure and robust user authentication system using Prisma ORM with PostgreSQL. Following this specific order ensures security is built-in from the ground up while maintaining application stability throughout the development process.

## Table of Contents

1. [Setting Up PostgreSQL](#1-setting-up-postgresql)
2. [Initializing Prisma](#2-initializing-prisma)
3. [Defining the User Model](#3-defining-the-user-model)
4. [Authentication Infrastructure](#4-authentication-infrastructure)
5. [User Registration Flow](#5-user-registration-flow)
6. [Login Implementation](#6-login-implementation)
7. [JWT Authentication Middleware](#7-jwt-authentication-middleware)
8. [Password Reset Flow](#8-password-reset-flow)
9. [User Profile Management](#9-user-profile-management)
10. [Security Enhancements](#10-security-enhancements)
11. [Email Service Implementation](#11-email-service-implementation)
12. [Main Server Setup](#12-main-server-setup)
13. [Frontend Integration](#13-frontend-integration)

---

## 1. Setting Up PostgreSQL

### Installation and Configuration

```bash
# Install PostgreSQL (if not already installed)
# For Windows (using Chocolatey):
choco install postgresql

# Or download and run the PostgreSQL installer from https://www.postgresql.org/download/
```

### Creating a Database

```bash
# Access PostgreSQL
psql -U postgres

# Create a database for our application
CREATE DATABASE devprofiles;

# Create a dedicated user for our application (best practice for security)
CREATE USER devprofiles_user WITH ENCRYPTED PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE devprofiles TO devprofiles_user;
```

📖 **What This Step Does**: Sets up the PostgreSQL database and creates a dedicated user with limited permissions, following the principle of least privilege.

🔧 **Configuration Notes**: Store database credentials securely in environment variables, never in code. The database name and user credentials should match across your PostgreSQL setup and application configuration.

---

## 2. Initializing Prisma

### Installing Dependencies

```bash
npm install prisma @prisma/client
npm install -D typescript ts-node @types/node
```

### Setting Up Prisma

```bash
npx prisma init
```

### Configure the Database Connection

Edit the `.env` file to include your PostgreSQL connection string:

```
DATABASE_URL="postgresql://devprofiles_user:your_secure_password@localhost:5432/devprofiles?schema=public"
```

📖 **What This Step Does**: Initializes Prisma and sets up the connection to your PostgreSQL database. Prisma will use this connection for all database operations.

🔧 **Configuration Notes**: 
- Don't commit the `.env` file to version control
- Create a separate `.env.example` file with placeholders for required variables
- Environment variable handling is critical for security

---

## 3. Defining the User Model

Edit the `prisma/schema.prisma` file to define your user model:

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                Int       @id @default(autoincrement())
  email             String    @unique
  username          String?   @unique
  password          String
  firstName         String?
  lastName          String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  emailVerified     Boolean   @default(false)
  verificationToken String?
  resetToken        String?
  resetTokenExpiry  DateTime?
  role              Role      @default(USER)
  
  // Relations will go here as the application grows
  // Example: posts, profile, etc.
}

enum Role {
  USER
  ADMIN
}
```

### Apply the Schema to the Database

```bash
npx prisma migrate dev --name init
```

📖 **What This Step Does**: Defines the user data model with all necessary fields for authentication and user management. The migration command creates the corresponding tables in your PostgreSQL database.

🔧 **Configuration Notes**: 
- Always use migrations to update your database schema
- The schema is designed with security in mind (password field for hashed passwords, verification tokens, etc.)
- Role-based access control is included from the start

---

## 4. Authentication Infrastructure

### Installing Authentication Dependencies

```bash
npm install bcrypt jsonwebtoken nodemailer
npm install -D @types/bcrypt @types/jsonwebtoken @types/nodemailer
```

### Creating Authentication Utilities

Create a folder structure for authentication:

```
server/
  flows/
    users/
      auth.utils.ts
      auth.controller.ts
      auth.routes.ts
      auth.types.ts
```

#### auth.types.ts

```typescript
export interface RegisterUserInput {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: number;
  role: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
```

#### auth.utils.ts

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from './auth.types';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
};

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
```

📖 **What This Step Does**: Creates the foundational utilities for all authentication operations, including password hashing, JWT generation and verification, and security token creation.

🔧 **Configuration Notes**: 
- JWT_SECRET should be a strong, random string stored in environment variables
- Password hashing is properly configured with industry-standard salt rounds
- Token generation uses cryptographically secure random bytes

---

## 5. User Registration Flow

### Creating the Controller

#### auth.controller.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { RegisterUserInput } from './auth.types';
import { hashPassword, generateVerificationToken, generateToken } from './auth.utils';
import { sendVerificationEmail } from '../../common/email.service';

const prisma = new PrismaClient();

export const registerUser = async (userData: RegisterUserInput) => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check username uniqueness if provided
    if (userData.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      if (existingUsername) {
        throw new Error('Username is already taken');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        verificationToken,
      },
    });

    // Send verification email
    await sendVerificationEmail(
      userData.email,
      verificationToken
    );

    // Generate JWT token (but don't include sensitive data)
    const token = generateToken({ 
      userId: newUser.id,
      role: newUser.role 
    });

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
      }
    };
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    // Update user's verification status
    return await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });
  } catch (error) {
    throw error;
  }
};
```

### Creating Routes

#### auth.routes.ts

```typescript
import express from 'express';
import { registerUser, verifyEmail } from './auth.controller';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const result = await registerUser(userData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Email verification endpoint
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    await verifyEmail(token);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

📖 **What This Step Does**: Implements a complete user registration flow including email verification, password hashing, and JWT generation. The process includes validation, security checks, and proper error handling.

🔧 **Configuration Notes**: 
- Email verification is crucial for preventing spam accounts
- Input validation should be added using a library like Zod or express-validator
- Error messages are user-friendly but not overly revealing (security best practice)

---

## 6. Login Implementation

### Updating the Controller

Add the login function to `auth.controller.ts`:

```typescript
import { LoginInput } from './auth.types';
import { comparePasswords, generateToken } from './auth.utils';

// ... existing code ...

export const loginUser = async (credentials: LoginInput) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const passwordValid = await comparePasswords(credentials.password, user.password);
    
    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    };
  } catch (error) {
    throw error;
  }
};
```

### Adding the Login Route

Update `auth.routes.ts`:

```typescript
// ... existing imports ...
import { registerUser, verifyEmail, loginUser } from './auth.controller';

// ... existing routes ...

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const credentials = req.body;
    const result = await loginUser(credentials);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// ... rest of the file ...
```

📖 **What This Step Does**: Implements user login with proper password comparison, role-based JWT generation, and verification checks. The controller follows security best practices by not revealing specific information in error messages.

🔧 **Configuration Notes**: 
- Generic "Invalid credentials" is used instead of specific errors to prevent enumeration attacks
- Email verification is enforced before login
- No sensitive data is returned to the client

---

## 7. JWT Authentication Middleware

### Creating the Middleware

Create a file `server/common/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../flows/users/auth.utils';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
      };
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN_STRING

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

### Implementing the Middleware

Add the middleware to protected routes:

```typescript
// Example of a protected route in another file
import { authenticateJWT, requireRole } from '../common/middleware/auth.middleware';

// Protected route accessible by all authenticated users
router.get('/profile', authenticateJWT, profileController.getUserProfile);

// Protected route accessible only by admins
router.get('/admin/users', authenticateJWT, requireRole('ADMIN'), adminController.getAllUsers);
```

📖 **What This Step Does**: Creates a reusable authentication middleware that validates JWT tokens and extracts user information. It also includes role-based authorization to restrict access to certain endpoints.

🔧 **Configuration Notes**: 
- Token verification uses the same secret key as token generation
- Request objects are extended with user information for use in controllers
- Role-based middleware allows fine-grained access control

---

## 8. Password Reset Flow

### Updating the Controller

Add password reset functions to `auth.controller.ts`:

```typescript
import { generatePasswordResetToken } from './auth.utils';
import { sendPasswordResetEmail } from '../../common/email.service';
import { ResetPasswordInput } from './auth.types';

// ... existing code ...

export const requestPasswordReset = async (email: string) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return { message: 'If your email is registered, you will receive a password reset link' };
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset email
    await sendPasswordResetEmail(
      user.email,
      resetToken
    );

    return { message: 'If your email is registered, you will receive a password reset link' };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: ResetPasswordInput) => {
  try {
    // Find user by reset token and check expiry
    const user = await prisma.user.findFirst({
      where: {
        resetToken: data.token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await hashPassword(data.newPassword);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  } catch (error) {
    throw error;
  }
};
```

### Adding Password Reset Routes

Update `auth.routes.ts`:

```typescript
// ... existing imports ...
import { 
  registerUser, 
  verifyEmail, 
  loginUser, 
  requestPasswordReset, 
  resetPassword 
} from './auth.controller';

// ... existing routes ...

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const resetData = req.body;
    const result = await resetPassword(resetData);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ... rest of the file ...
```

📖 **What This Step Does**: Implements a secure password reset flow with time-limited tokens and proper security measures. This includes token generation, storage, email notification, and secure password updates.

🔧 **Configuration Notes**: 
- Reset tokens expire after a set time (1 hour)
- Generic messages are used to prevent user enumeration
- Passwords are properly hashed before storage

---

## 9. User Profile Management

### Creating the Controller

Create a new file `server/flows/users/profile.controller.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePasswords } from './auth.utils';

const prisma = new PrismaClient();

export const getUserProfile = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        role: true,
        emailVerified: true,
        // Don't include sensitive fields
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId: number, updateData: any) => {
  // Don't allow updating sensitive fields directly
  const { password, role, emailVerified, ...safeUpdateData } = updateData;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: safeUpdateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        role: true,
        emailVerified: true,
      },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const passwordValid = await comparePasswords(currentPassword, user.password);
    
    if (!passwordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash and save new password
    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw error;
  }
};
```

### Creating Profile Routes

Create a new file `server/flows/users/profile.routes.ts`:

```typescript
import express from 'express';
import { getUserProfile, updateUserProfile, updatePassword } from './profile.controller';
import { authenticateJWT } from '../../common/middleware/auth.middleware';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const profile = await getUserProfile(req.user.userId);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const updateData = req.body;
    const updatedProfile = await updateUserProfile(req.user.userId, updateData);
    res.status(200).json(updatedProfile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
router.post('/change-password', authenticateJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    const result = await updatePassword(req.user.userId, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

📖 **What This Step Does**: Implements user profile management functionality, including viewing, updating, and password changing. The implementation includes proper authentication checks and data filtering.

🔧 **Configuration Notes**: 
- All routes require authentication
- Sensitive fields are filtered out from both input and output
- Password changes require verification of the current password

---

## 10. Security Enhancements

### Rate Limiting

Install the rate limiting package:

```bash
npm install express-rate-limit
```

Create a middleware in `server/common/middleware/rate-limit.middleware.ts`:

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// More strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts from this IP, please try again after an hour',
});
```

### CORS Configuration

Install CORS package:

```bash
npm install cors
npm install -D @types/cors
```

Configure CORS in your main server file:

```typescript
import cors from 'cors';

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### Implementing Helmet for Security Headers

Install Helmet:

```bash
npm install helmet
```

Add Helmet to your server:

```typescript
import helmet from 'helmet';

// Add Helmet middleware
app.use(helmet());
```

📖 **What This Step Does**: Adds essential security enhancements including rate limiting to prevent brute force attacks, CORS configuration to prevent cross-origin vulnerabilities, and security headers via Helmet to protect against various attacks.

🔧 **Configuration Notes**: 
- Rate limits are stricter for authentication endpoints
- CORS is configured differently for development and production
- Helmet adds important security headers by default

---

> **Note on Implementation Order:** 
> 
> The following sections (11-13) can be implemented after you've completed and tested the initial authentication setup (sections 1-10). It's recommended to ensure your core authentication flow is working properly before adding these enhancements. You can temporarily mock the email service functionality by logging verification tokens to the console during development. This approach ensures you have a fully working implementation without errors before adding more complex features.

## 11. Email Service Implementation

The registration and password reset flows reference an email service that hasn't been implemented yet. Let's create that service.

Create a file `server/common/email.service.ts`:

```typescript
import nodemailer from 'nodemailer';

// Configure nodemailer with your email service provider
// For development, you can use a test account from Ethereal
// For production, use a real email service like SendGrid, Mailgun, etc.
let transporter: nodemailer.Transporter;

// Initialize the email service
const initEmailService = async () => {
  // For development/testing - create test account
  if (process.env.NODE_ENV !== 'production') {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    // Create a test transporter
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log('Ethereal Email test account created:', testAccount.user);
  } else {
    // For production - use your configured email service
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

// Call this function to initialize the email service
initEmailService().catch(console.error);

// Send email verification
export const sendVerificationEmail = async (
  to: string,
  token: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Dev Profiles" <${process.env.EMAIL_FROM || 'noreply@devprofiles.com'}>`,
    to,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Dev Profiles!</h2>
        <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
        <p>
          <a 
            href="${verificationUrl}" 
            style="display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 4px;"
          >
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      // For development - log the URL to access the test email
      console.log('Email verification message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  to: string,
  token: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Dev Profiles" <${process.env.EMAIL_FROM || 'noreply@devprofiles.com'}>`,
    to,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to create a new password:</p>
        <p>
          <a 
            href="${resetUrl}" 
            style="display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 4px;"
          >
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      // For development - log the URL to access the test email
      console.log('Password reset message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// You can add more email templates as needed (welcome emails, notifications, etc.)
```

📖 **What This Step Does**: Creates a reusable email service that handles sending verification and password reset emails. The service uses Nodemailer and includes development and production configurations.

🔧 **Configuration Notes**: 
- For development, it uses Ethereal Email (a fake SMTP service)
- For production, configure your email provider details in environment variables
- Email templates include both HTML buttons and plain text links for accessibility

---

## 12. Main Server Setup

Now let's tie everything together with the main server setup.

Create or update your main server file `server/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { apiLimiter, authLimiter } from './common/middleware/rate-limit.middleware';

// Import routes
import authRoutes from './flows/users/auth.routes';
import profileRoutes from './flows/users/profile.routes';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Apply general rate limiting to all routes
app.use(apiLimiter);

// Apply strict rate limiting to authentication routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Serve frontend static files
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle SPA routing - redirect all non-API routes to React app
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    }
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // Close the server
  server.close(() => {
    console.log('Server closed');
  });
  
  // Disconnect Prisma client
  await prisma.$disconnect();
  
  process.exit(0);
});

// Export for testing purposes
export { app, server, prisma };
```

📖 **What This Step Does**: Sets up the main Express server that ties together all the authentication components. It includes middleware configuration, route registration, error handling, and production setup for serving the frontend.

🔧 **Configuration Notes**: 
- Security features are applied globally
- Rate limiting is more strict for authentication endpoints
- Production setup serves the built React frontend
- Graceful shutdown ensures database connections are properly closed

---

## 13. Frontend Integration

Let's add instructions for integrating with the frontend React application.

### Setting Up Auth Context

Create a file `client/src/context/AuthContext.tsx`:

```typescript
import React, { createContext, useState, useEffect, useContext } from 'react';

// Define types
interface User {
  id: number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<User>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  // Register function
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update profile function
  const updateProfile = async (userData: any) => {
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed');
      }
      
      setUser(data);
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Provide the context value
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Creating an API Request Helper

Create a file `client/src/utils/api.ts`:

```typescript
// API utility for making authenticated requests

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  requiresAuth = true
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem('token');
    
    // Check if authentication is required but no token exists
    if (requiresAuth && !token) {
      return {
        error: 'Authentication required',
        status: 401,
      };
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    // Prepare request options
    const options: RequestInit = {
      method,
      headers,
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && body) {
      options.body = JSON.stringify(body);
    }
    
    // Make the request
    const response = await fetch(`${API_URL}/${endpoint}`, options);
    const data = await response.json();
    
    // Return standardized response
    return {
      data: response.ok ? data : undefined,
      error: !response.ok ? data.error : undefined,
      status: response.status,
    };
  } catch (error) {
    // Handle network errors
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0, // 0 indicates network error
    };
  }
};

// Convenience methods
export const get = <T>(endpoint: string, requiresAuth = true) => 
  apiRequest<T>(endpoint, 'GET', undefined, requiresAuth);

export const post = <T>(endpoint: string, body: any, requiresAuth = true) => 
  apiRequest<T>(endpoint, 'POST', body, requiresAuth);

export const put = <T>(endpoint: string, body: any, requiresAuth = true) => 
  apiRequest<T>(endpoint, 'PUT', body, requiresAuth);

export const del = <T>(endpoint: string, requiresAuth = true) => 
  apiRequest<T>(endpoint, 'DELETE', undefined, requiresAuth);
```

### Sample Login Page Component

Create a file `client/src/pages/LoginPage.tsx`:

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
```

### Connecting All the Pieces Together

To properly tie all components together, add the routes to your React Router setup in `client/src/App.tsx`:

```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          
          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
```

Finally, ensure your application's environment variables are properly set up in your `.env` file:

```
# Backend
PORT=3000
DATABASE_URL="postgresql://devprofiles_user:your_secure_password@localhost:5432/devprofiles?schema=public"
JWT_SECRET="your-strong-secret-key-at-least-32-characters"
NODE_ENV="development"

# Email Configuration
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@example.com"
EMAIL_PASSWORD="your-email-password"
EMAIL_FROM="noreply@devprofiles.com"
EMAIL_SECURE="false"

# Frontend URL (for verification links)
FRONTEND_URL="http://localhost:5173"
```

## Why This Setup Order Matters

1. **Database First**: Starting with PostgreSQL and Prisma ensures a solid data foundation before building authentication logic.

2. **User Model Early**: Defining the user model with all necessary fields early prevents disruptive schema changes later.

3. **Auth Utils Before Controllers**: Building authentication utilities before controllers ensures consistent security practices.

4. **Registration Before Login**: Implementing registration before login allows for immediate testing of the user creation flow.

5. **JWT Middleware Before Protected Routes**: Creating the authentication middleware before any protected routes ensures consistent protection.

6. **Account Recovery After Core Auth**: Adding password reset after core authentication ensures basic functionality works first.

7. **Profile Management After Auth**: Building profile management after authentication uses the security infrastructure already in place.

8. **Security Enhancements Last**: Adding rate limiting and other protections after core functionality allows for targeted configuration.

This order minimizes application disruption during development while ensuring security is built-in from the ground up rather than added as an afterthought.

---

## Conclusion

This authentication setup provides a robust foundation for your application with proper security measures at every step. By following this guide, you've implemented:

1. Secure password handling with bcrypt
2. JWT-based authentication
3. Email verification
4. Password reset functionality
5. Role-based access control
6. Profile management
7. Protection against common security vulnerabilities

As your application grows, consider adding additional security measures like two-factor authentication, account lockout after failed attempts, and regular security audits.
