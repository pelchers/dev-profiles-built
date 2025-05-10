# Prisma + PostgreSQL + Authentication Setup Guide (with GitHub Integration)

This guide provides a full, self-contained walkthrough for setting up a secure authentication system using **Prisma**, **PostgreSQL**, and **Express**, extended to support **GitHub profile linking**. It assumes no prior context or setup.

---

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
# Install PostgreSQL (Mac/Linux/Windows)
# On Mac:
brew install postgresql

# On Windows (using Chocolatey):
choco install postgresql

# Or download installer:
https://www.postgresql.org/download/
```

### Create Database and User
```bash
psql -U postgres

CREATE DATABASE devprofiles;
CREATE USER devprofiles_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE devprofiles TO devprofiles_user;
```

---

## 2. Initializing Prisma

### Install Prisma & TypeScript Packages
```bash
npm install prisma @prisma/client
npm install -D typescript ts-node @types/node
```

### Initialize Prisma
```bash
npx prisma init
```

### Setup `.env`
```
DATABASE_URL="postgresql://devprofiles_user:your_secure_password@localhost:5432/devprofiles?schema=public"
```

---

## 3. Defining the User Model

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                Int      @id @default(autoincrement())
  email             String   @unique
  username          String?  @unique
  password          String
  firstName         String?
  lastName          String?
  githubUrl         String?
  githubUsername    String?
  emailVerified     Boolean  @default(false)
  verificationToken String?
  resetToken        String?
  resetTokenExpiry  DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  role              Role     @default(USER)
}

enum Role {
  USER
  ADMIN
}
```

### Run Migration
```bash
npx prisma migrate dev --name init
```

---

## 4. Authentication Infrastructure

### Install Dependencies
```bash
npm install bcrypt jsonwebtoken nodemailer axios
npm install -D @types/bcrypt @types/jsonwebtoken @types/nodemailer
```

### Project Folder Structure
```
server/
  flows/
    users/
      auth.utils.ts
      auth.types.ts
      auth.controller.ts
      auth.routes.ts
    github/
      github.controller.ts
      github.routes.ts
  common/
    middleware/
      auth.middleware.ts
    email.service.ts
```

---

### auth.types.ts
```ts
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

---

### auth.utils.ts
```ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthTokenPayload } from './auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => bcrypt.hash(password, SALT_ROUNDS);
export const comparePasswords = async (password: string, hashed: string) => bcrypt.compare(password, hashed);
export const generateToken = (payload: AuthTokenPayload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
export const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');
export const generatePasswordResetToken = () => crypto.randomBytes(32).toString('hex');
```

---

## 5. User Registration Flow

### auth.controller.ts (registerUser)
```ts
import { PrismaClient } from '@prisma/client';
import { RegisterUserInput } from './auth.types';
import { hashPassword, generateVerificationToken, generateToken } from './auth.utils';
import { sendVerificationEmail } from '../../common/email.service';

const prisma = new PrismaClient();

const extractGitHubUsername = (url: string): string => {
  const match = url?.match(/github\.com\/([^\/]+)/);
  return match ? match[1] : '';
};

export const registerUser = async (userData: RegisterUserInput) => {
  const existing = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existing) throw new Error('User with this email already exists');

  const usernameTaken = userData.username && await prisma.user.findUnique({ where: { username: userData.username } });
  if (usernameTaken) throw new Error('Username is taken');

  const password = await hashPassword(userData.password);
  const verificationToken = generateVerificationToken();
  const githubUsername = userData.githubUrl ? extractGitHubUsername(userData.githubUrl) : undefined;

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      password,
      verificationToken,
      githubUsername,
    },
  });

  await sendVerificationEmail(newUser.email, verificationToken);

  const token = generateToken({ userId: newUser.id, role: newUser.role });
  return {
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      emailVerified: newUser.emailVerified,
      githubUrl: newUser.githubUrl,
      githubUsername: newUser.githubUsername,
    },
  };
};
```

---

## 6. Login Implementation

Extend the login logic in `auth.controller.ts` to also return `githubUsername` and `githubUrl`:

```ts
export const loginUser = async (credentials: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user || !(await comparePasswords(credentials.password, user.password))) {
    throw new Error('Invalid credentials');
  }
  if (!user.emailVerified) throw new Error('Please verify your email');

  const token = generateToken({ userId: user.id, role: user.role });
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
      githubUsername: user.githubUsername,
    },
  };
};
```

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

export const requestPasswordReset = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If your email is registered, you will receive a password reset link' };

    const resetToken = generatePasswordResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(user.email, resetToken);
    return { message: 'If your email is registered, you will receive a password reset link' };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: ResetPasswordInput) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: data.token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new Error('Invalid or expired reset token');

    const hashedPassword = await hashPassword(data.newPassword);

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

```typescript
// auth.routes.ts
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const resetData = req.body;
    const result = await resetPassword(resetData);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
```

📖 **What This Step Does**: Implements a secure password reset flow using time-sensitive tokens. GitHub-related fields are not involved in this logic.

🔧 **Configuration Notes**:
- Return value is user-agnostic to prevent data leaks
- GitHub profile data is unaffected by password resets

---

## 9. User Profile Management

In `getUserProfile` and `updateUserProfile`, ensure that:

- `githubUrl` and `githubUsername` are included in the `select` and returned to the frontend:

```ts
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
}
```

- In `updateUserProfile`, when the `githubUrl` field is updated, re-extract and update the `githubUsername`:

```ts
const extractGitHubUsername = (url: string): string => {
  const match = url?.match(/github\.com\/([^\/]+)/);
  return match ? match[1] : '';
};

const { githubUrl, ...safeData } = updateData;
const githubUsername = githubUrl ? extractGitHubUsername(githubUrl) : undefined;

const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: {
    ...safeData,
    githubUrl,
    githubUsername,
  },
});
```

Ensure that updates from the profile edit form reflect both GitHub fields.

---


## 10–13: Security, Email, Server, and Frontend Integration

The following sections can and **should be implemented after the core authentication and GitHub flows are tested and verified to be working in development**. These enhancements ensure your application is production-ready, but delaying them until after core flow validation avoids early complexity and helps isolate debugging.

All logic from the original file remains unchanged **except**:
- Include `githubUrl` in frontend forms
- Include GitHub badge or hover UI components by fetching GitHub data via `/api/github/:username`

All logic from the original file remains unchanged **except**:
- Include `githubUrl` in frontend forms
- Include GitHub badge or hover UI components by fetching GitHub data via `/api/github/:username`

---

✅ GitHub profile support is now deeply integrated into your full authentication flow, from schema to registration to profile updates. You can now proceed with building the GitHub enrichment UI and API routes in the `github-flow.md` file.

## 10. Security Enhancements *(implement after core flows are tested)*

### 🔐 Rate Limiting Middleware
```ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later.'
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, try again later.'
});
```
Apply using:
```ts
app.use('/api/auth/login', authLimiter);
```

### 🧢 Helmet Middleware
```ts
import helmet from 'helmet';
app.use(helmet());
```

### 🌐 CORS Middleware
```ts
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
```

---

## 11. Email Service Implementation *(implement after registration/login is tested)*

Create `email.service.ts`:
```ts
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

export async function initEmailService() {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });
}

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your email',
    html: `<a href='${verifyUrl}'>Click to verify</a>`
  });
};
```
Call `initEmailService()` in `server/index.ts`.

---

## 12. Main Server Setup *(do after core auth tested)*

```ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { initEmailService } from './common/email.service';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

initEmailService();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/github', githubRoutes);
```

---

## 13. Frontend Integration *(implement after backend tested)*

### 🧠 Include GitHub Profile Fields in Form
Update registration/profile forms to include:
```ts
<input name="githubUrl" placeholder="https://github.com/username" />
```

### 🖼️ Display GitHub Card or Hover UI
Use the `/api/github/:username` route to fetch and display:
- `avatar_url`, `name`, `public_repos`, `followers`
- As tooltips on hover or embedded profile badge

### 🧭 Flow File Placement
```
client/
  src/
    components/
      flows/
        profiles/
          GitHubCard.tsx
          GitHubHoverTooltip.tsx
    utils/githubApi.ts
```

---

✅ GitHub profile support is now deeply integrated into your full authentication flow, from schema to registration to profile updates. You can now proceed with building the GitHub enrichment UI and API routes in the `github-flow.md` file.
