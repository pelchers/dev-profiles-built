# Development vs Build Mode Guide

This guide explains how to run and test the application in both development and production (build) modes, with particular focus on email functionality.

## Development Mode

Development mode provides:
- Hot module reloading for frontend (Vite server on port 5173)
- Automatic server restarts with nodemon (Express server on port 3000)
- Ethereal Email for testing (no real emails sent)
- Detailed error messages and logs

### Setup for Development

1. Create a `.env` file in the root directory:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (not required in development, will use Ethereal)
# EMAIL_SERVICE=gmail
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
# EMAIL_RECIPIENT=recipient@example.com
```

2. Install dependencies:
```bash
npm install
```

3. Start development servers:
```bash
npm run dev
```

This runs both frontend and backend servers concurrently:
- Frontend: Vite dev server on port 5173 (http://localhost:5173)
- Backend: Express with nodemon on port 3000 (http://localhost:3000/api/*)

### Testing Contact Form in Development

1. Navigate to the Contact page in your browser (http://localhost:5173/contact)
2. Fill out the form and submit
3. Check the server console for a preview URL like:
```
Preview URL: https://ethereal.email/message/AbCdEfGhIjKlMnOp
```
4. Open this URL to view the test email (no real email is sent)
5. The server will log:
   - Environment
   - Email Service
   - Email User (Set/Not Set)
   - Email Pass (Set/Not Set)
   - Ethereal Test Account information

## Production (Build) Mode

Production mode provides:
- Optimized frontend bundle
- Minified code
- Real email sending via Gmail or Outlook
- Single server architecture (Express serves the built frontend)

### Setup for Production

1. Create a production `.env` file:
```
# Server Configuration
PORT=3000
NODE_ENV=production

# Email Configuration (REQUIRED for production)
EMAIL_SERVICE=gmail  # or outlook
EMAIL_USER=your-real-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_RECIPIENT=recipient@example.com
```

2. Make sure you've set up appropriate email credentials:
   - For Gmail: 
     - Enable 2-Step Verification in your Google Account
     - Generate an App Password (Google Account → Security → App Passwords)
     - Use this 16-character password (no spaces) in EMAIL_PASS
   - For Outlook: 
     - Enable 2FA if required
     - Generate an App Password and use in EMAIL_PASS

### Running in Production Mode

#### Local Testing of Production Build

##### Windows PowerShell:
```powershell
$env:NODE_ENV="production"
npm run start
```

##### Windows Command Prompt:
```cmd
set NODE_ENV=production && npm run start
```

##### Linux/Mac:
```bash
NODE_ENV=production npm run start
```

The `npm run start` script will:
1. Build the TypeScript files and Vite frontend bundle
2. Start the Node.js server in production mode
3. Serve the optimized frontend files from the `/dist` directory
4. Use real email provider for sending emails

#### Verifying Production Build

1. Navigate to http://localhost:3000 (not the Vite port 5173)
2. Test the contact form
3. Check for real emails in the recipient's inbox/spam folder
4. Check server logs for email sending status

## How Email Configuration Works

Our application uses different email configurations based on the NODE_ENV value:

### Development Mode (`NODE_ENV=development`)
- Uses Nodemailer's Ethereal service
- Creates a temporary test account automatically
- Captures emails and provides a preview URL
- No real emails are sent

### Production Mode (`NODE_ENV=production`)
- Uses the specified EMAIL_SERVICE (gmail or outlook)
- Requires valid EMAIL_USER and EMAIL_PASS credentials
- Sends real emails to EMAIL_RECIPIENT (or falls back to EMAIL_USER)
- Uses proper SMTP configuration for each service:
  - Gmail: smtp.gmail.com, port 465, secure
  - Outlook: smtp-mail.outlook.com, port 587, not secure

## Troubleshooting

### Development Mode Issues

- **No Ethereal Email Preview**: 
  - Check server logs for errors
  - Ensure internet connection (needed to create Ethereal account)
  - Try restarting the server

- **Frontend/Backend Connection Issues**: 
  - Ensure API calls are pointing to the correct URL (http://localhost:3000/api/...)
  - Check browser console for CORS errors
  - Verify frontend proxy settings

### Production Mode Issues

- **Gmail Authentication Errors**:
  - Verify Gmail has 2-Step Verification enabled
  - Confirm App Password is being used (not regular account password)
  - Check that App Password is correctly entered (no spaces)
  - Try generating a new App Password
  - Check if "Less secure app access" needs to be enabled (older accounts)

- **Outlook Authentication Errors**:
  - Check credentials are correct
  - Consider using App Password if 2FA is enabled
  - Verify SMTP settings match outlook requirements

- **Build Errors**:
  - Check TypeScript errors in console
  - Verify all imports are correctly resolved
  - Check Vite build configuration

- **Routing Issues**:
  - Ensure all API routes are correctly prefixed with '/api'
  - Verify Express is serving the correct static files
  - Check that catch-all route is properly configured for SPA routing

## Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| NODE_ENV | development | production | Environment mode |
| PORT | 3000 (default) | 3000 (default) | Server port |
| EMAIL_SERVICE | (not required) | gmail/outlook | Email service provider |
| EMAIL_USER | (not required) | your-email | Email username |
| EMAIL_PASS | (not required) | app-password | Email password |
| EMAIL_RECIPIENT | (not required) | recipient | Email recipient |

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend development servers |
| `npm run dev:frontend` | Start only Vite frontend dev server |
| `npm run dev:backend` | Start only Express backend dev server with nodemon |
| `npm run build` | Build TypeScript and Vite frontend for production |
| `npm run start` | Build and start production server |
| `npm run preview` | Preview the production build locally (Vite preview) | 