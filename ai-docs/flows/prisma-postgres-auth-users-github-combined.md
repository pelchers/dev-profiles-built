# Prisma + PostgreSQL + Authentication Setup Guide (with GitHub Integration)

This guide provides a comprehensive, step-by-step approach to setting up a secure and robust user authentication system using Prisma ORM with PostgreSQL, extended with GitHub profile integration. Following this specific order ensures security is built-in from the ground up while maintaining application stability throughout the development process.

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
10. [GitHub Integration](#10-github-integration)
11. [Security Enhancements](#11-security-enhancements)
12. [Email Service Implementation](#12-email-service-implementation)
13. [Main Server Setup](#13-main-server-setup)
14. [Frontend Integration](#14-frontend-integration)

---

## 1. Setting Up PostgreSQL

### Installation and Configuration

```bash
# Install PostgreSQL (if not already installed)
# For Windows (using Chocolatey):
choco install postgresql

# For Mac:
brew install postgresql

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

Edit the `prisma/schema.prisma` file to define your user model, including GitHub-related fields:

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
  githubUrl         String?
  githubUsername    String?
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

📖 **What This Step Does**: Defines the user data model with all necessary fields for authentication, user management, and GitHub integration. The migration command creates the corresponding tables in your PostgreSQL database.

🔧 **Configuration Notes**: 
- Always use migrations to update your database schema
- The schema is designed with security in mind (password field for hashed passwords, verification tokens, etc.)
- Role-based access control is included from the start
- GitHub fields allow for user profile enrichment

---

## 4. Authentication Infrastructure

### Installing Authentication Dependencies

```bash
npm install bcrypt jsonwebtoken nodemailer axios
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
    github/
      github.controller.ts
      github.routes.ts
  common/
    middleware/
      auth.middleware.ts
    email.service.ts
```

#### auth.types.ts

```typescript
export interface RegisterUserInput {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  githubUrl?: string;
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

export const extractGitHubUsername = (url: string): string => {
  const match = url?.match(/github\.com\/([^\/]+)/);
  return match ? match[1] : '';
};
```

📖 **What This Step Does**: Creates the foundational utilities for all authentication operations, including password hashing, JWT generation and verification, security token creation, and GitHub URL processing.

🔧 **Configuration Notes**: 
- JWT_SECRET should be a strong, random string stored in environment variables
- Password hashing is properly configured with industry-standard salt rounds
- Token generation uses cryptographically secure random bytes
- GitHub username extraction uses regex for consistent parsing

---

## 5. User Registration Flow

### Creating the Controller

#### auth.controller.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { RegisterUserInput } from './auth.types';
import { hashPassword, generateVerificationToken, generateToken, extractGitHubUsername } from './auth.utils';
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

    // Extract GitHub username if URL is provided
    const githubUsername = userData.githubUrl 
      ? extractGitHubUsername(userData.githubUrl) 
      : undefined;

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
        githubUrl: userData.githubUrl,
        githubUsername,
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
        githubUrl: newUser.githubUrl,
        githubUsername: newUser.githubUsername
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

📖 **What This Step Does**: Implements a complete user registration flow including email verification, password hashing, and JWT generation. The process includes validation, security checks, proper error handling, and GitHub username extraction from the provided URL.

🔧 **Configuration Notes**: 
- Email verification is crucial for preventing spam accounts
- Input validation should be added using a library like Zod or express-validator
- Error messages are user-friendly but not overly revealing (security best practice)
- GitHub integration happens during registration for a seamless experience

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
        githubUrl: user.githubUrl,
        githubUsername: user.githubUsername
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

📖 **What This Step Does**: Implements user login with proper password comparison, role-based JWT generation, and verification checks. The controller follows security best practices by not revealing specific information in error messages, and returns GitHub profile data as part of the user object.

🔧 **Configuration Notes**: 
- Generic "Invalid credentials" is used instead of specific errors to prevent enumeration attacks
- Email verification is enforced before login
- GitHub profile data is returned as part of the login response

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
- GitHub profile data is preserved during password resets

---

## 9. User Profile Management

### Creating the Controller

Create a new file `server/flows/users/profile.controller.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePasswords, extractGitHubUsername } from './auth.utils';

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
        githubUrl: true,
        githubUsername: true,
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
  try {
    // Don't allow updating sensitive fields directly
    const { password, role, emailVerified, resetToken, resetTokenExpiry, verificationToken, ...safeUpdateData } = updateData;

    // Extract GitHub username if GitHub URL is updated
    let githubUsername;
    if (safeUpdateData.githubUrl) {
      githubUsername = extractGitHubUsername(safeUpdateData.githubUrl);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...safeUpdateData,
        githubUsername: safeUpdateData.githubUrl ? githubUsername : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        githubUrl: true,
        githubUsername: true,
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

📖 **What This Step Does**: Implements user profile management functionality, including viewing, updating, password changing, and GitHub profile management. The implementation includes proper authentication checks, data filtering, and GitHub username extraction.

🔧 **Configuration Notes**: 
- All routes require authentication
- Sensitive fields are filtered out from both input and output
- Password changes require verification of the current password
- GitHub username is automatically extracted from the URL when updating profiles

---

## 10. GitHub Integration

### Creating GitHub Controller and Routes

Create a new file `server/flows/github/github.controller.ts`:

```typescript
import axios from 'axios';

export const fetchGitHubProfile = async (username: string) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
  } catch (error) {
    throw new Error('GitHub profile not found or API limit reached');
  }
};
```

Create a new file `server/flows/github/github.routes.ts`:

```typescript
import express from 'express';
import { fetchGitHubProfile } from './github.controller';

const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: 'GitHub username is required' });
    }

    const githubData = await fetchGitHubProfile(username);
    res.status(200).json(githubData);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
```

### Creating Frontend Components for GitHub Integration

Here are the key GitHub integration components for the frontend:

#### GitHubApi Utility

Create a file `client/src/utils/githubApi.ts`:

```typescript
export const getGitHubStats = async (username: string) => {
  if (!username) return null;
  
  try {
    const res = await fetch(`/api/github/${username}`);
    if (!res.ok) throw new Error('GitHub fetch failed');
    return res.json();
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return null;
  }
};
```

#### GitHubCard Component

Create a file `client/src/components/flows/profiles/GitHubCard.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { getGitHubStats } from '../../../utils/githubApi';

export function GitHubCard({ username }: { username: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      setLoading(true);
      getGitHubStats(username)
        .then(data => {
          setProfile(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Could not load GitHub profile');
          setLoading(false);
        });
    }
  }, [username]);

  if (!username) return null;
  if (loading) return <div className="p-4 border rounded-lg">Loading GitHub profile...</div>;
  if (error) return <div className="p-4 border rounded-lg text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="p-4 border rounded-xl shadow bg-white">
      <div className="flex items-center gap-4">
        <img 
          src={profile.avatar_url} 
          alt={`${profile.login}'s GitHub avatar`}
          className="w-16 h-16 rounded-full" 
        />
        <div>
          <h2 className="text-lg font-bold">{profile.name || profile.login}</h2>
          <a 
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-sm text-blue-500 hover:underline"
          >
            @{profile.login}
          </a>
        </div>
      </div>
      
      {profile.bio && (
        <p className="mt-3 text-sm text-gray-600">{profile.bio}</p>
      )}
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="font-bold">{profile.public_repos}</div>
          <div className="text-xs text-gray-500">Repositories</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="font-bold">{profile.followers}</div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="font-bold">{profile.following}</div>
          <div className="text-xs text-gray-500">Following</div>
        </div>
      </div>
    </div>
  );
}
```

#### GitHubHoverTooltip Component

Create a file `client/src/components/flows/profiles/GitHubHoverTooltip.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { getGitHubStats } from '../../../utils/githubApi';

export function GitHubHoverTooltip({ username }: { username: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (username) {
      setLoading(true);
      getGitHubStats(username)
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [username]);

  if (!username || loading || !data) return null;

  return (
    <div className="absolute z-10 p-3 bg-white shadow-lg border rounded-lg max-w-[250px]">
      <div className="flex items-center gap-2">
        <img src={data.avatar_url} className="w-10 h-10 rounded-full" alt="GitHub avatar" />
        <div>
          <div className="text-sm font-semibold">{data.name || data.login}</div>
          <div className="text-xs text-blue-500">@{data.login}</div>
        </div>
      </div>
      
      {data.bio && (
        <div className="mt-2 text-xs text-gray-500">{data.bio}</div>
      )}
      
      <div className="mt-2 flex justify-between text-xs">
        <div>
          <span className="font-medium">{data.public_repos}</span> repos
        </div>
        <div>
          <span className="font-medium">{data.followers}</span> followers
        </div>
        <div>
          <span className="font-medium">{data.following}</span> following
        </div>
      </div>
    </div>
  );
}
```

### Usage of GitHub Components

These components can be used in various parts of your application:

1. In the user profile page:
```tsx
import { GitHubCard } from '../components/flows/profiles/GitHubCard';

function ProfilePage({ user }) {
  return (
    <div>
      <h1>{user.displayName}</h1>
      {/* Other profile content */}
      
      {user.githubUsername && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">GitHub Profile</h2>
          <GitHubCard username={user.githubUsername} />
        </div>
      )}
    </div>
  );
}
```

2. For hover effects on user avatars or profile cards:
```tsx
import { useState } from 'react';
import { GitHubHoverTooltip } from '../components/flows/profiles/GitHubHoverTooltip';

function UserAvatar({ user }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img 
        src={user.avatarUrl} 
        alt={user.displayName}
        className="w-10 h-10 rounded-full" 
      />
      {showTooltip && user.githubUsername && (
        <GitHubHoverTooltip username={user.githubUsername} />
      )}
    </div>
  );
}
```

📖 **What This Step Does**: Creates a complete GitHub integration system that fetches GitHub profile data via the GitHub REST API and displays it in various UI components. This enhances user profiles with rich GitHub data.

🔧 **Configuration Notes**: 
- The backend API route shields the frontend from direct GitHub API calls
- Components handle loading and error states gracefully
- Hover tooltips provide a rich, interactive experience
- GitHub data enhances user profiles throughout the application

---

## 11. Security Enhancements

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

// Limiter for GitHub API calls to prevent abuse/rate limiting issues
export const githubLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // limit each IP to 30 GitHub API requests per 5 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many GitHub API requests, please try again later',
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

### Apply Rate Limiters

In your main server file, apply the rate limiters:

```typescript
import { apiLimiter, authLimiter, githubLimiter } from './common/middleware/rate-limit.middleware';

// Apply general rate limiting to all routes
app.use(apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Apply GitHub rate limiting
app.use('/api/github', githubLimiter);
```

📖 **What This Step Does**: Adds essential security enhancements including rate limiting to prevent brute force attacks, CORS configuration to prevent cross-origin vulnerabilities, and security headers via Helmet to protect against various attacks.

🔧 **Configuration Notes**: 
- Rate limits are stricter for authentication endpoints
- Special rate limits for GitHub API to prevent exhausting external quotas
- CORS is configured differently for development and production
- Helmet adds important security headers by default

---

## 12. Email Service Implementation

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

## 13. Main Server Setup

Now let's tie everything together with the main server setup.

Create or update your main server file `server/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { apiLimiter, authLimiter, githubLimiter } from './common/middleware/rate-limit.middleware';

// Import routes
import authRoutes from './flows/users/auth.routes';
import profileRoutes from './flows/users/profile.routes';
import githubRoutes from './flows/github/github.routes';

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

// Apply GitHub rate limiting
app.use('/api/github', githubLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/github', githubRoutes);

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

📖 **What This Step Does**: Sets up the main Express server that ties together all the components (authentication, profile management, GitHub integration). It includes middleware configuration, route registration, error handling, and production setup for serving the frontend.

🔧 **Configuration Notes**: 
- Security features are applied globally
- Rate limiting is configured for sensitive endpoints
- GitHub routes have specific rate limiting to prevent API quota issues
- Production setup serves the built React frontend
- Graceful shutdown ensures database connections are properly closed

---

## 14. Frontend Integration

Let's add instructions for integrating with the frontend React application, focusing on the GitHub integration aspects.

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
  githubUrl?: string;
  githubUsername?: string;
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

### Creating Registration Page with GitHub Field

Create a file `client/src/pages/RegisterPage.tsx`:

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    githubUrl: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
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
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First Name (optional)"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last Name (optional)"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="githubUrl" className="sr-only">GitHub Profile URL</label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="GitHub Profile URL (optional, e.g. https://github.com/username)"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
```

### Profile Page with GitHub Component

Create a file `client/src/pages/ProfilePage.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GitHubCard } from '../components/flows/profiles/GitHubCard';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    githubUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        githubUrl: user.githubUrl || '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await updateProfile(formData);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setIsEditing(false);
    } catch (err: any) {
      setMessage({ text: err.message || 'Update failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div className="text-center p-8">Please log in to view your profile</div>;
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername"
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Adding your GitHub URL will let people see your public repositories
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 px-3 py-1 rounded-md text-sm"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p>{user.username || 'Not set'}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{user.email}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p>
                  {user.firstName || user.lastName
                    ? `${user.firstName || ''} ${user.lastName || ''}`
                    : 'Not set'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">GitHub Profile</h3>
                {user.githubUrl ? (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {user.githubUrl}
                  </a>
                ) : (
                  <p>Not set</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div>
          {user.githubUsername ? (
            <GitHubCard username={user.githubUsername} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">GitHub Profile</h2>
              <p className="text-gray-600 mb-4">
                Add your GitHub URL to display your profile and stats
              </p>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 px-3 py-1 rounded-md text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
```

### Complete App Routes

Set up your routes in `client/src/App.tsx`:

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

📖 **What This Step Does**: Integrates the backend authentication and GitHub features with a React frontend. This includes authentication context management, registration with GitHub URL field, profile management with GitHub display, and route protection.

🔧 **Configuration Notes**: 
- User data including GitHub profile is stored in the auth context
- Forms include GitHub URL fields for user input
- GitHub components display enriched profile data
- Routes are protected based on authentication status

---

## Why This Setup Order Matters

1. **Database First**: Starting with PostgreSQL and Prisma ensures a solid data foundation before building authentication logic.

2. **User Model Early**: Defining the user model with all necessary fields early, including GitHub integration fields, prevents disruptive schema changes later.

3. **Auth Utils Before Controllers**: Building authentication utilities before controllers ensures consistent security practices.

4. **Registration Before Login**: Implementing registration before login allows for immediate testing of the user creation flow, including GitHub profile linking.

5. **JWT Middleware Before Protected Routes**: Creating the authentication middleware before any protected routes ensures consistent protection.

6. **Account Recovery After Core Auth**: Adding password reset after core authentication ensures basic functionality works first.

7. **Profile Management After Auth**: Building profile management after authentication uses the security infrastructure already in place.

8. **GitHub Integration Alongside User Management**: Integrating GitHub functionality alongside user management allows for a seamless user experience.

9. **Security Enhancements Last**: Adding rate limiting and other protections after core functionality allows for targeted configuration.

This order minimizes application disruption during development while ensuring security is built-in from the ground up rather than added as an afterthought.

---

## Conclusion

This guide provides a comprehensive setup for a secure authentication system with GitHub profile integration. By following these steps, you've implemented:

1. Secure user registration and authentication
2. Email verification and password reset
3. JWT-based authentication with role-based access control
4. User profile management including GitHub profile linking
5. GitHub API integration for rich profile data
6. Security measures including rate limiting and proper headers
7. Frontend components that work seamlessly with the backend

The application now offers a complete authentication and user management experience with the added value of GitHub profile integration, displaying repository counts, followers, and other GitHub statistics to enhance user profiles.

For a live demo of this integration, see the GitHub card components on a user's profile page after they've added a GitHub URL. The extraction of GitHub username from the URL happens automatically, and the system handles API rate limits and error states gracefully.

As your application grows, you can extend this system with more social integrations, additional profile fields, and enhanced GitHub functionality such as repository listings or activity feeds. 