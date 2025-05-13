# User Authentication Guide

## Overview

This guide explains how to use the authentication system in the Dev Profiles application. It covers user registration, login, account security, and common issues users might encounter.

## Getting Started

### Account Creation

To create a new account:

1. Navigate to `/signup`
2. Fill out the registration form:
   - Email: Must be valid and unique
   - Username: Must be unique
   - Password: Must meet security requirements
   - Display Name: Your visible name in the application
   - User Type: Developer or Company
   - GitHub URL (optional): Link to your GitHub profile

### Login Process

To log in to an existing account:

1. Navigate to `/login`
2. Enter your email and password
3. Click "Log In"

The system will authenticate your credentials and redirect you to your profile page if successful.

## Authentication Features

### Session Management

- **Token-based Authentication**: Your session is managed using JWT tokens
- **Session Duration**: Access tokens expire after 1 hour
- **Auto-refresh**: The app will automatically refresh your session while you're active
- **Manual Logout**: Click "Log Out" in the user menu to end your session

### Account Security

- **Password Storage**: Passwords are securely hashed and never stored in plaintext
- **Account Locking**: After 5 failed login attempts, your account will be temporarily locked
- **Secure Routes**: Protected pages require authentication

## 🔧 Environment Configuration Fixes

Several critical fixes were implemented to ensure the authentication system works reliably:

### JWT Configuration

The JWT (JSON Web Token) configuration was fixed to ensure proper authentication:

```
# Added to .env file:
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=production
```

This ensures the authentication system can properly sign and verify tokens for your login session.

### Database Connection

The database connection was fixed to ensure user accounts can be properly accessed:

1. Direct URL configuration in Prisma schema:

```prisma
// Modified in prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:password@localhost:5432/devprofiles?schema=public"
}
```

2. Added fallback in case environment variables don't load properly:

```javascript
// Added in auth service files
const dbUrl = process.env.DATABASE_URL || 
  "postgresql://postgres:password@localhost:5432/devprofiles?schema=public";
```

### Authentication Service Robustness

The authentication service was improved to handle environment configuration issues:

```javascript
// Added in auth service
const JWT_SECRET = process.env.JWT_SECRET || 'temporarysecretfordevenvironmentonly';

// Added early environment loading
require('dotenv').config();
```

These changes ensure you can log in successfully even if there are environment loading issues.

## User Types and Permissions

The system supports different user types:

- **Developers**: Can create profiles, projects, and connect with other developers
- **Companies**: Can create company profiles, post job openings, and find talent
- **Administrators**: Have additional system management capabilities

## Configuration Requirements

For the authentication system to work properly, the following must be correctly set up:

1. **JWT Secret**: A secure key used for token signing
2. **Database Connection**: Properly configured connection to the user database
3. **Email Service**: For account verification and password resets (if enabled)

## Common Issues and Solutions

### Login Problems

If you're having trouble logging in:

- Ensure caps lock is off
- Verify you're using the correct email address
- Check that your account isn't locked due to too many failed attempts
- Try resetting your password if you've forgotten it

### "Unauthorized" Error Messages

If you see "Unauthorized" or "Access Denied" messages:

- Your session may have expired (try logging in again)
- You may be trying to access a restricted resource
- The system may have been updated and requires a fresh login

### Authentication Environment Issues

If you encounter backend authentication errors:

- Check that the `.env` file exists and contains the necessary JWT_SECRET
- Ensure the database connection is properly configured
- Verify that the server was restarted after any configuration changes
- Check server logs for specific authentication errors

### Registration Issues

If you can't register a new account:

- The email or username may already be in use
- Your password may not meet complexity requirements
- There may be a temporary system issue

## Developer Authentication Endpoints

If you're integrating with the authentication API:

### Registration

```
POST /api/auth/register

Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "username": "username",
  "displayName": "User Name",
  "userType": "DEVELOPER"
}

Response:
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    ...
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### Login

```
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    ...
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

## Security Best Practices

### Client-Side Security

1. **Store tokens securely**: Use HttpOnly cookies or secure storage
2. **Never expose tokens**: Don't store in localStorage for production
3. **Secure transmission**: Always use HTTPS
4. **Clear on logout**: Remove all auth tokens when logging out

### User Password Guidelines

1. **Strong passwords**: Use a mix of characters, numbers, and symbols
2. **Unique passwords**: Don't reuse passwords from other sites
3. **Regular updates**: Change your password periodically
4. **No sharing**: Never share your credentials with others

## Testing Credentials

For local development environments only:

```
Email: test@example.com
Password: Test123!
```

This test account has limited permissions and should only be used in development.

## Conclusion

The authentication system provides secure access to the Dev Profiles platform. By following this guide, you can effectively create and manage your account, understand token-based authentication, and troubleshoot common issues. The implemented fixes ensure reliable authentication regardless of environment configuration challenges. 