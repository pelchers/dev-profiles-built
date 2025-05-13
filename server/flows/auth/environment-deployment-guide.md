# Environment Variables & Deployment Guide

## Overview

This document explains how environment variables are handled in the Dev Profiles application, with specific focus on differences between local development and Render.com deployment. Understanding these differences is critical for successful authentication and database connectivity.

## Environment Variable Loading

### Local Development Issues

During local development, we encountered several challenges with environment variables:

1. **Prisma Schema Environment Loading**
   - Prisma loads environment variables at build/generation time, not just at runtime
   - Variables in `.env` weren't consistently available to Prisma during schema processing
   - Solution: Hardcoded the database URL directly in the schema file

2. **Loading Order Problems**
   - Environment variables were sometimes being accessed before `dotenv.config()` fully loaded them
   - Solution: Added `require('dotenv').config()` at the top of critical files
   - Added fallbacks for essential variables

3. **Variable Scope Issues**
   - Variables loaded in one process weren't automatically available to child processes
   - Solution: Implemented fallbacks and direct variable loading in each key module

### Implemented Fallbacks

We implemented these fallbacks to ensure the application remains functional:

```javascript
// Database URL fallback
const dbUrl = process.env.DATABASE_URL || 
  "postgresql://postgres:password@localhost:5432/devprofiles?schema=public";

// JWT secret fallback
const JWT_SECRET = process.env.JWT_SECRET || 'temporarysecretfordevenvironmentonly';

// Email credential fallbacks
const emailCredentials = {
  user: process.env.EMAIL_USER || 'your.email@gmail.com',
  pass: process.env.EMAIL_PASS || 'your16characterapppassword',
  recipient: process.env.EMAIL_RECIPIENT || 'recipient@example.com'
};
```

## Render.com Deployment

Render.com handles environment variables differently from local development:

### How Render.com Environment Variables Work

1. **System-Level Injection**
   - Render.com injects environment variables at the system/OS level
   - Variables are available to all processes including Prisma
   - No dotenv package needed for variable loading

2. **Initialization Sequence**
   - Variables are fully loaded before any application code runs
   - Eliminates loading order problems we faced locally

3. **Environment Variable Precedence**
   - System-level variables (set in Render.com) take precedence over fallbacks
   - Our pattern `process.env.VARIABLE || 'fallback'` ensures Render variables are used when available

### Required Render.com Environment Variables

Set these in the Render.com dashboard:

```
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_secure_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=yoursixteencharpass
EMAIL_RECIPIENT=where.to.send@gmail.com
PORT=3000 (or let Render set this automatically)
```

## Prisma Schema Considerations

For Prisma schema specifically, you have two options for Render.com deployment:

### Option 1: Keep Hardcoded URL (Simpler)

Continue using the hardcoded database URL in `schema.prisma` but update it to match your production database:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:password@production-db-host:5432/devprofiles?schema=public"
}
```

### Option 2: Switch Back to Environment Variable (More Flexible)

Modify `schema.prisma` to use environment variables again:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This works on Render.com because their environment variables are available during Prisma's build process.

## Verifying Environment Variables on Render.com

We've added diagnostic code to verify environment variables are properly loaded:

```javascript
// Added in server.cjs
if (process.env.NODE_ENV === 'production') {
  console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);
  console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
  // Add other critical variables
}
```

Check your Render.com logs after deployment to confirm variables are loaded correctly.

## Security Considerations

1. **Never commit real secrets** to version control
2. **Use strong, unique values** for JWT_SECRET in production
3. **Regenerate compromised secrets** if you suspect any security issues
4. **Restrict environment variable access** in your Render.com team settings

## Recommended Configuration Pattern

Follow this pattern for environment-dependent configurations:

```javascript
// Get environment variables with fallbacks
const config = {
  database: process.env.DATABASE_URL || 'fallback-for-development-only',
  jwtSecret: process.env.JWT_SECRET || 'fallback-for-development-only',
  isProduction: process.env.NODE_ENV === 'production',
  // Additional configuration variables
};

// Log configuration status (but not the actual secrets)
console.log('Configuration loaded:', {
  database: !!config.database,
  jwtSecret: !!config.jwtSecret,
  environment: process.env.NODE_ENV || 'undefined',
});

// Export configuration for use in the application
module.exports = config;
```

## Conclusion

The fallbacks we implemented ensure the application remains functional during local development while making it fully compatible with Render.com's environment variable system. When deploying to Render.com, just ensure all required environment variables are set in their dashboard, and the application will automatically use them instead of the fallbacks. 