# Profile System Environment Configuration

## Overview

This document explains how environment variables affect the profile system in the Dev Profiles application. It covers database connections, GitHub integration, and other environment-dependent features specific to user profiles.

## Environment Variable Dependencies

The profile system depends on these critical environment variables:

1. **Database Connection** - For storing and retrieving profile data
2. **GitHub API Token** - For fetching GitHub profile information
3. **JWT Secret** - For authorizing profile access and modifications

## Environment Variable Access in Profile Flow

### Database Connection

Profile data is stored in and retrieved from the PostgreSQL database configured in the Prisma schema:

```javascript
// Profile service database access
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fallback for database connection issues
try {
  // Test database connection
  await prisma.$connect();
  console.log('Profile system connected to database successfully');
} catch (error) {
  console.error('Profile system database connection error:', error.message);
  // Implement graceful degradation for database issues
}
```

### GitHub API Integration

The profile system uses GitHub API for importing user repositories and profile data:

```javascript
// GitHub API token access with fallback
const githubToken = process.env.GITHUB_TOKEN || 'fallback-for-development-only';
const githubApiUrl = process.env.GITHUB_API_URL || 'https://api.github.com';

// GitHub API client with environment configuration
const githubClient = {
  baseUrl: githubApiUrl,
  headers: {
    Authorization: `token ${githubToken}`,
    'User-Agent': 'Dev-Profiles-App'
  }
};
```

### Profile Image Storage

Profile images may depend on cloud storage configuration:

```javascript
// Profile image storage configuration
const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 'local',
  bucket: process.env.STORAGE_BUCKET || 'uploads',
  path: process.env.STORAGE_PATH || './uploads'
};
```

## Environment-Specific Behavior

### Development Mode

In development mode (`NODE_ENV=development`):

- Profile images are stored locally
- GitHub API limits are carefully managed
- Database operations have detailed logging

### Production Mode

In production mode (`NODE_ENV=production`):

- Profile images may use cloud storage (S3, etc.)
- GitHub API calls use production token with higher limits
- Database operations are optimized for performance

## Required Environment Variables for Render.com

For proper profile functionality on Render.com, set these additional variables:

```
# GitHub Integration (required for GitHub profile import)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_API_URL=https://api.github.com

# Profile Image Storage (optional)
STORAGE_PROVIDER=s3
STORAGE_BUCKET=your-bucket-name
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
```

## Fallback Mechanisms in Profile Flow

The profile system implements these fallbacks for development:

```javascript
// Configuration fallbacks for profile system
const profileConfig = {
  // GitHub fallbacks
  githubToken: process.env.GITHUB_TOKEN || null,
  githubApiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
  
  // Storage fallbacks
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  storagePath: process.env.STORAGE_PATH || './uploads',
  
  // Features based on environment
  enableGithubSync: process.env.ENABLE_GITHUB_SYNC !== 'false',
  profileCacheTime: parseInt(process.env.PROFILE_CACHE_TIME || '3600')
};
```

## Profile-Specific Environment Issues

### GitHub API Rate Limiting

GitHub API has strict rate limits that may affect profile functionality:

- Development tokens typically have lower limits (60 requests/hour)
- Production tokens can have higher limits (5,000 requests/hour)
- Set `GITHUB_TOKEN` in production to avoid rate limiting

### Large Profile Data Handling

For profiles with extensive data (many repositories, etc.):

- Configure `PROFILE_FETCH_LIMIT=50` to limit items fetched
- Set `PROFILE_CACHE_TIME=3600` (seconds) to cache profile data
- Use `PROFILE_LAZY_LOADING=true` to defer loading of detailed data

## Troubleshooting Profile Environment Issues

### Common Profile Loading Issues

1. **Profiles Load Slowly**
   - Check `GITHUB_TOKEN` is valid and not rate-limited
   - Verify database connection performance
   - Enable profile caching with appropriate `PROFILE_CACHE_TIME`

2. **GitHub Data Not Showing**
   - Verify `GITHUB_TOKEN` is set and valid
   - Check GitHub API rate limits in response headers
   - Look for GitHub API errors in server logs

3. **Profile Images Not Loading**
   - Verify storage configuration variables
   - Check file permissions for local storage
   - Ensure cloud storage credentials are correct

## Conclusion

The profile system is designed to work seamlessly with the environment variable configuration established for the application. The fallbacks ensure development functionality, while proper configuration in Render.com's dashboard enables full production capability. Always set the required environment variables in production to ensure all profile features function correctly. 