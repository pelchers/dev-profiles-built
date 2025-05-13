# Environment Variables Reference

This document provides a reference for all environment variables used in the Dev Profiles application.

## Database Configuration

```
# PostgreSQL connection string (required)
DATABASE_URL=postgres://username:password@localhost:5432/dev_profiles?schema=public
```

## Application Settings

```
# Port for the server to listen on (defaults to 3000 if not specified)
PORT=3000

# Node environment (development, production, test)
NODE_ENV=development

# JWT Secret for authentication (required for production)
JWT_SECRET=your_secure_jwt_secret_key

# Frontend URL for CORS configuration (defaults to localhost:5173 in development)
FRONTEND_URL=http://localhost:5173
```

## GitHub Integration

```
# GitHub Personal Access Token (optional but recommended to avoid rate limiting)
GITHUB_TOKEN=your_github_personal_access_token

# GitHub API URL (defaults to https://api.github.com)
GITHUB_API_URL=https://api.github.com

# GitHub webhook secret (for future webhook implementation)
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret
```

## Email Service (Future Implementation)

```
# SMTP server settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@example.com
```

## Development Notes

- In development, you can create a `.env` file in the root directory with these variables
- For production, set these variables in your hosting environment (e.g., Render.com)
- Never commit your `.env` file to version control (it's included in `.gitignore`)
- The `JWT_SECRET` should be a secure random string in production
- Obtain a GitHub Personal Access Token from your GitHub account settings

## Adding New Environment Variables

When adding new environment variables:

1. Update this document with the new variable
2. Add the variable to any deployment environments
3. Update type definitions if necessary 