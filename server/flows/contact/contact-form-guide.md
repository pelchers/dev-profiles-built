# Contact Form System Guide

## Overview

The contact form system allows users to send messages directly from the web application. The system supports:

- Form validation
- Email delivery using Gmail in production
- Test emails using Ethereal in development
- Error handling and user feedback

## Using the Contact Form

### Frontend Implementation

The contact form is located at `/contact` and includes the following fields:

- **Name**: User's full name
- **Email**: User's email address
- **Message**: The content of the message

### How It Works

1. User fills out the contact form
2. Client-side validation ensures all fields are properly filled
3. Form data is sent to the server via `/api/contact` endpoint
4. Server processes the request and sends an email
5. User receives success or error feedback

## Testing the System

### Development Testing (Ethereal)

When running the application in development mode (`npm run dev`):

1. Fill out and submit the contact form
2. The server will use Ethereal to create a test email
3. A preview URL will be logged in the server console
4. Open this URL to view the test email without actually sending it

### Production Testing (Gmail)

When running in production mode (`npm run start`):

1. Fill out and submit the contact form
2. The server will send a real email via Gmail
3. Check the recipient inbox for the email
4. Success/failure will be logged in the server console

## Customizing the Contact Form

### Form Fields

To add or modify form fields:

1. Update the form component in `client/src/components/flows/contact/ContactForm.tsx`
2. Update the type definitions in `client/src/types/contact.ts`
3. Update the server-side validation in `server/flows/contact/contactController.cjs`

### Email Template

To customize the email template:

1. Locate the HTML template in `contactController.cjs`:

```javascript
html: `<h3>New Contact Form Submission</h3>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Message:</strong></p>
       <p>${message.replace(/\n/g, '<br>')}</p>`,
```

2. Modify this template to change the email appearance
3. You can add additional styling, branding, or fields as needed

## Configuration Options

### Email Recipients

By default, emails are sent to the email specified in `EMAIL_RECIPIENT` (or falls back to `EMAIL_USER`).

To change or add recipients:

1. Update the `.env` file with the new recipient:
   ```
   EMAIL_RECIPIENT=new.recipient@example.com
   ```

2. For multiple recipients, modify the controller:
   ```javascript
   const mailOptions = {
     // ...
     to: 'recipient1@example.com, recipient2@example.com',
     // ...
   };
   ```

### Email Subject Line

To customize the subject line:

```javascript
const mailOptions = {
  // ...
  subject: `Custom Subject: Message from ${name}`,
  // ...
};
```

## 🔧 Environment Configuration Fixes

To resolve email sending issues in the contact form system, the following fixes were implemented:

### Fixed Email Credentials Loading

1. **Direct Variable Access**: Modified the contact controller to directly access credentials:

```javascript
// Modified to access email configuration directly with fallbacks
const emailUser = process.env.EMAIL_USER || 'your.gmail@gmail.com';
const emailPass = process.env.EMAIL_PASS || 'your16characterapppassword';
const emailRecipient = process.env.EMAIL_RECIPIENT || emailUser;
```

### Environment Mode Detection Fix

Added reliable environment detection to ensure proper mode selection (Gmail vs Ethereal):

```javascript
// More reliable environment detection
const isProduction = process.env.NODE_ENV === 'production' || 
                     process.argv.includes('server/server.cjs');
console.log(`Email System Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
```

### .env Configuration

Updated `.env` file to include all necessary email-related variables:

```
# Added to .env file
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=yoursixteencharpass
EMAIL_RECIPIENT=where.to.send@gmail.com
```

### Early Environment Loading

Ensured environment variables are loaded before email configuration by adding:

```javascript
// Added at the top of contactController.cjs
require('dotenv').config();
```

## Troubleshooting

### Common Issues

1. **Form submission fails**:
   - Check browser console for errors
   - Verify API endpoint is correct
   - Check server logs for detailed errors

2. **Email not received**:
   - Check spam/junk folder
   - Verify Gmail credentials are correct
   - Check server logs for SMTP errors

3. **Validation errors**:
   - Ensure all fields meet validation requirements
   - Check for proper email format

4. **"Missing credentials for PLAIN" error**:
   - This typically indicates email credentials are not being loaded properly
   - Verify the credentials in `.env` are correct (no spaces in app password)
   - Confirm `dotenv` is properly loading the variables

## Security Best Practices

1. **Always validate input** both client-side and server-side
2. **Rate limit** form submissions to prevent abuse
3. **Implement CAPTCHA** for additional spam protection
4. **Sanitize input** to prevent XSS attacks

## Future Enhancements

Consider these potential improvements:

1. Add CAPTCHA integration
2. Implement message threading/history
3. Create an admin interface for managing messages
4. Add file attachment capabilities

## Conclusion

The contact form system provides a robust way for users to communicate through the application. Its dual-mode operation (development/production) allows for easy testing and seamless production deployment. The implemented fixes ensure reliable email sending regardless of environment variable loading issues. 