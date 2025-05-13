# Email System Implementation Guide

## Overview

This document explains how the email system is implemented in the Dev Profiles application. The system supports both development testing with Ethereal and production sending with Gmail.

## How It Works

The email system operates in two distinct modes:

1. **Production Mode**: Sends real emails using Gmail SMTP
2. **Development Mode**: Uses Ethereal for testing without sending real emails

### Mode Detection

The system automatically detects which mode to use based on:

- The `NODE_ENV` environment variable
- The command used to start the server
- Whether required credentials are available

```javascript
// Simplified detection logic
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.NODE_ENV === undefined || 
                    process.argv.includes('server/server.cjs');
```

## Configuration

### Gmail Credentials Setup

The system uses Gmail SMTP for sending real emails in production. You need an app password (not your regular Gmail password):

1. Enable 2-Step Verification in your Google Account
   - Go to your Google Account → Security
   - Enable 2-Step Verification if not already enabled

2. Create an App Password
   - Go to your Google Account → Security → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it something like "Dev Profiles Contact Form" 
   - Copy the 16-character password (no spaces)

3. Configure the .env file
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=16characterpassword
   EMAIL_RECIPIENT=where.to.send@gmail.com
   ```

## Implementation Details

### Contact Controller

The email functionality is implemented in `server/flows/contact/contactController.cjs`. Key components:

#### 1. Environment Detection

```javascript
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.NODE_ENV === undefined || 
                    process.argv.includes('server/server.cjs');
```

#### 2. Email Configuration (Production)

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: emailCredentials.user,
    pass: emailCredentials.pass,
  },
});
```

#### 3. Ethereal Testing (Development)

```javascript
const testAccount = await nodemailer.createTestAccount();
const testTransporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass
  }
});
```

## 🔧 Environment Variable Fixes

To fix email sending issues, the following changes were made:

### Direct Hardcoding Fix

Due to issues with environment variable loading, we temporarily hardcoded the email credentials in the controller:

```javascript
// FIXED: Hardcoded credentials as fallback when env variables weren't loading properly
const emailCredentials = {
  user: process.env.EMAIL_USER || 'your.actual.email@gmail.com',
  pass: process.env.EMAIL_PASS || 'your16digitapppassword',
  recipient: process.env.EMAIL_RECIPIENT || 'recipient.email@gmail.com'
};
```

### Gmail App Password Formatting

A critical fix was removing all spaces from the Gmail app password. The 16-character password must be used without any spaces:

```
# WRONG:
EMAIL_PASS=abcd efgh ijkl mnop

# CORRECT:
EMAIL_PASS=abcdefghijklmnop
```

### NODE_ENV Configuration

Added explicit NODE_ENV setting in the .env file to ensure proper mode detection:

```
NODE_ENV=production
```

### Dotenv Loading Fix

Ensured dotenv loads early in the application bootstrap process by adding:

```javascript
// At the top of contactController.cjs
require('dotenv').config();
```

## Troubleshooting

### Email Not Sending in Production

1. Check if Gmail credentials are correct
2. Verify environment mode detection is working (`console.log` should show "Using REAL email with Gmail")
3. Check Gmail security settings (allow less secure apps if needed)
4. Try hardcoding credentials temporarily if environment variables aren't loading

### Development Testing Issues

1. Ensure Ethereal can be reached (network connectivity)
2. Check browser console for preview URL
3. Try manually creating an Ethereal account and using those credentials

## Frontend Integration

The frontend connects to this system via the contact form API:

```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

## Security Considerations

1. **Environment Variables**: Always use environment variables for credentials in production
2. **Error Handling**: Don't expose detailed error messages to clients in production
3. **Input Validation**: Always validate user input before processing
4. **HTTPS**: Use HTTPS in production to protect data in transit

## Commands and Environment

- `npm run dev` - Development mode (uses Ethereal)
- `npm run start` - Production mode (uses real Gmail)

## Conclusion

This email system provides a flexible approach for both development and production, allowing testing without sending real emails while also supporting actual email delivery in production. The implemented fixes ensure reliable email delivery regardless of environment variable loading issues. 