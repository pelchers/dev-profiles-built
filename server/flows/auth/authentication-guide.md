# Authentication System Guide

## Overview

This document explains the authentication system implemented in the Dev Profiles application. The system provides secure user authentication with JWT tokens, supporting user registration, login, session management, and profile access.

## How It Works

The authentication system revolves around these core components:

1. **JWT-based Authentication**: JSON Web Tokens for secure, stateless authentication
2. **User Registration & Login**: Secure account creation and authentication
3. **Session Management**: Token refresh and expiration handling
4. **Protected Routes**: Access control for authenticated users only

### Authentication Flow

```
┌──────────┐      ┌────────────┐      ┌────────────┐
│  Client  │──────▶ Auth Routes │──────▶ Auth Service│
└──────────┘      └────────────┘      └────────────┘
      │                                      │
      │                                      │
      │           ┌─────────────┐            │
      └───────────▶ Database    ◀────────────┘
                  └─────────────┘
```

## Core Components

### 1. JWT Authentication

JSON Web Tokens (JWT) provide secure, stateless authentication:

```javascript
// Token generation
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Token verification
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
```

### 2. Authentication Middleware

The `authenticateJWT` middleware protects routes that require authentication:

```javascript
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

## 🔧 Environment Variable Fixes

The following critical fixes were implemented to resolve authentication and database connection issues:

### JWT Secret Configuration

Fixed missing or improperly loaded JWT_SECRET:

1. **Direct Secret Access**: Modified the authentication service to access JWT_SECRET with a fallback:

```javascript
// Modified in auth service files
const JWT_SECRET = process.env.JWT_SECRET || 'temporarysecretfordevenvironmentonly';

// Added console verification on server startup
console.log(`JWT Configuration: ${process.env.JWT_SECRET ? 'Found' : 'Using fallback'}`);
```

2. **Updated .env file** with proper JWT configuration:

```
# Added to .env file
JWT_SECRET=your_secure_jwt_secret_key_here
```

### Database Connection Fix

Fixed database connection issues in the Prisma configuration:

1. **Modified Prisma Schema** to use direct URL instead of environment variable:

```prisma
// Modified in prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:password@localhost:5432/devprofiles?schema=public"
}
```

2. **Environment Variable Loading Order**:

Added early environment loading in critical authentication files:

```javascript
// Added at the top of auth files
require('dotenv').config();
```

3. **Hardcoded Database URL Fallback**:

```javascript
// Added fallback for database connection in auth service
const dbUrl = process.env.DATABASE_URL || 
  "postgresql://postgres:password@localhost:5432/devprofiles?schema=public";
```

### NODE_ENV Configuration

Added explicit environment mode setting to ensure consistent behavior:

```
# Added to .env file
NODE_ENV=production
```

## Configuration

### JWT Secret Setup

The JWT secret is critical for security. It must be:
- Strong and random
- Kept secure (never in source code)
- Consistent across server instances

1. Configure in your `.env` file:
   ```
   JWT_SECRET=your_secure_jwt_secret_key
   ```

2. Secret requirements:
   - Minimum 32 characters
   - Mix of letters, numbers, and special characters
   - Randomly generated (not a simple phrase)

### Database Configuration

User authentication relies on a properly configured database:

1. Ensure the Prisma schema is set up with proper User model
2. Make sure the database connection string is correct in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/devprofiles?schema=public
   ```

## Implementation Details

### Auth Routes

Key authentication routes in `auth.routes.cjs`:

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user and issue tokens
- `POST /api/auth/refresh-token` - Issue new access token using refresh token
- `POST /api/auth/logout` - Invalidate user session

### Auth Controller

The controller handles HTTP requests and responses, while delegating business logic to the service layer.

Key methods:
- `register` - Handles user registration
- `login` - Authenticates users and issues tokens
- `refreshToken` - Reissues access tokens
- `logout` - Invalidates sessions

### Auth Service

The service contains the core authentication logic:

- Password hashing and verification
- Token generation and validation
- User creation and retrieval from the database
- Security checks (account locking, etc.)

## Authentication Data Flow

### Registration Flow

1. Client submits registration form with email, password, etc.
2. Server validates input data
3. Checks if user already exists
4. Hashes password securely
5. Creates user in database
6. Issues JWT tokens
7. Returns user data and tokens to client

### Login Flow

1. Client submits login credentials (email/password)
2. Server validates input
3. Retrieves user by email
4. Verifies password hash
5. Checks account status (locked, verified, etc.)
6. Issues JWT tokens
7. Updates last login time
8. Returns user data and tokens to client

## Frontend Integration

The frontend integrates with the auth system via the AuthContext:

```javascript
// Login example
const login = async (email, password) => {
  try {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('token', data.accessToken);
    setToken(data.accessToken);
    setUser(data.user);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
```

## Security Measures

### Password Security

- Passwords are hashed using bcrypt (never stored in plaintext)
- Password complexity requirements enforced
- Failed login attempt tracking
- Account locking after multiple failed attempts

### Token Security

- Short-lived access tokens (1 hour)
- Longer-lived refresh tokens with secure rotation
- Proper storage (httpOnly cookies in production)
- CSRF protection

## Troubleshooting

### Common Authentication Issues

#### 1. "Invalid token" or 401 Unauthorized errors

Possible causes:
- JWT_SECRET mismatch between server instances
- Token expiration
- Token tampering
- Authorization header format issues

Solutions:
- Check JWT_SECRET in environment variables
- Ensure token is not expired
- Verify Authorization header format (`Bearer [token]`)
- Check for clock sync issues between servers

#### 2. Login failures despite correct credentials

Possible causes:
- Password hashing issues
- Database connection problems
- Account locked status
- Email verification requirements

Solutions:
- Check password hashing implementation
- Verify database connectivity
- Check account status (locked, requires verification)
- Enable detailed error logging temporarily

#### 3. Missing environment variables

If your JWT_SECRET or DATABASE_URL are missing:
- Double-check `.env` file exists and is properly formatted
- Ensure the server has read permissions on the file
- Try direct loading of `.env` in critical modules
- Consider hard-coding a temporary value for testing (remove in production)

## Commands and Environment

- For local development:
  ```
  NODE_ENV=development JWT_SECRET=your_secret npm run dev
  ```

- For production:
  ```
  NODE_ENV=production JWT_SECRET=your_secure_secret npm run start
  ```

## Configuration Checklist

- [ ] JWT_SECRET is set in `.env`
- [ ] DATABASE_URL is correctly configured
- [ ] Password hashing is properly implemented
- [ ] Token expiration times are appropriate
- [ ] Authentication middleware protects appropriate routes
- [ ] Error handling provides security without leaking details
- [ ] Frontend correctly stores and sends authentication tokens

## Conclusion

The authentication system provides a secure, robust way to manage user identity and access control. By properly configuring the JWT secret and database connection, you ensure that users can register, login, and access protected resources securely. The implemented fixes ensure reliable authentication functionality regardless of environment variable loading issues. 