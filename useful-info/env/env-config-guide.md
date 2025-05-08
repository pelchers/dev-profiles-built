# Email Configuration Guide

This guide explains how to set up the environment variables for the contact form email functionality using Nodemailer.

## Environment Modes

The application supports two environment modes:

- **Development Mode**: Uses Ethereal Email for testing (emails are not actually sent but captured for preview)
- **Production Mode**: Uses real email services (Gmail or Outlook) to send actual emails

## Development Environment Setup

For development, the system will automatically create a test account with Ethereal. You don't need to provide real email credentials.

1. Create a `.env` file in the root directory with:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (not required for dev mode, will use Ethereal)
# EMAIL_SERVICE=gmail
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
# EMAIL_RECIPIENT=recipient@example.com
```

2. When you submit the contact form in development mode, check the console logs for a preview URL that looks like:
```
Preview URL: https://ethereal.email/message/AbCdEfGhIjKlMnOp
```

3. Click this URL to view the test email that would have been sent.

## Production Environment Setup

For production, you need to provide real email credentials. You can choose between Gmail or Outlook:

### Option 1: Gmail Configuration

1. Enable 2-Step Verification in your Google account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Name it something like "Nodemailer App"
   - Copy the 16-character password that Google generates

3. Create a `.env` file (or update your existing one) with:
```
# Server Configuration
PORT=3000
NODE_ENV=production

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcdefghijklmnop  # 16-character app password with NO spaces
EMAIL_RECIPIENT=recipient@example.com
```

### Option 2: Outlook/Office 365 Configuration

1. Go to your Microsoft account: https://account.microsoft.com/
2. Navigate to "Security" > "Advanced security options"
3. Enable two-step verification if not already enabled
4. Return to the security page and select "App passwords"
5. Create a new app password for "Nodemailer"
6. Copy the generated password

7. Create a `.env` file (or update your existing one) with:
```
# Server Configuration
PORT=3000
NODE_ENV=production

# Email Configuration
EMAIL_SERVICE=outlook
EMAIL_USER=your-outlook@outlook.com
EMAIL_PASS=your-app-password
EMAIL_RECIPIENT=recipient@example.com
```

## Deployment Considerations

When deploying to production:

1. Make sure environment variables are correctly set in your hosting platform
2. Double-check that `NODE_ENV=production` is set
3. For security, do not commit your `.env` file to version control
4. Your app's server needs to be able to connect to SMTP ports (usually 465/587)

## Testing Production Configuration

To test your production configuration locally:

```bash
# PowerShell
$env:NODE_ENV='production'
npm run dev

# Bash/Linux/Mac
NODE_ENV=production npm run dev
```

## Troubleshooting

### Authentication Errors

- **Gmail**: "Username and Password not accepted"
  - Make sure 2-Step Verification is enabled
  - Check that you're using an App Password, not your regular password
  - Remove any spaces from the App Password

- **Outlook**: "Invalid login"
  - Verify your Outlook credentials
  - Check if you need an App Password with 2FA enabled

### Connection Issues

- **Connection timeout/refused**:
  - Ensure your server/hosting environment allows outbound connections to the email provider
  - Check for firewall or proxy issues

### Configuration Tips

- Do not use quotes around values in your `.env` file
- Make sure there are no extra spaces before or after values
- Email addresses should be properly formatted (e.g., `user@example.com`)

## References

- Nodemailer documentation: https://nodemailer.com/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Outlook App Passwords: https://support.microsoft.com/en-us/account-billing/manage-app-passwords-for-two-step-verification-d6dc8c6d-4bf7-4851-ad95-6d07799387e9 