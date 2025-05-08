# =================================================================
# EMAIL ENVIRONMENT CONFIGURATION GUIDE
# =================================================================

# IMPORTANT: DO NOT SET NODE_ENV IN THIS FILE
# The NODE_ENV is automatically set by npm scripts:
#  - npm run dev    -> sets NODE_ENV=development (uses Ethereal)
#  - npm run start  -> sets NODE_ENV=production (uses real email)
# 
# If you set NODE_ENV here, it will override the npm script settings
# and your email configuration may not work as expected.

# =================================================================
# SERVER CONFIGURATION
# =================================================================
PORT=3000

# =================================================================
# OPTIONAL ENV STRICT SETTING BY DEV
# =================================================================
# Uncomment the line below to enable strict mode

##NODE_ENV=developmentORproduction

# =================================================================
# EMAIL CONFIGURATION
# =================================================================
# These settings are used in production mode (npm run start)
# In development mode (npm run dev), Ethereal is used instead

# Email Service: gmail or outlook
EMAIL_SERVICE=gmail

# Your email address
EMAIL_USER=pelycluk@gmail.com

# For Gmail: Use an App Password (not your regular password)
# How to create an App Password:
# 1. Enable 2-Step Verification in your Google Account
# 2. Go to Security → App Passwords
# 3. Generate a new password for "Mail" on "Other (Custom name)"
# 4. Paste the 16-character code here (no spaces)
EMAIL_PASS=dtiy lwsa qmsp imfd

# Optional: Where to send contact form submissions
# If not set, defaults to EMAIL_USER
EMAIL_RECIPIENT=pelycluk@gmail.com

# =================================================================
# EMAIL PROVIDER INSTRUCTIONS
# =================================================================
# GMAIL SETUP:
# - Set EMAIL_SERVICE=gmail
# - Set EMAIL_USER to your Gmail address
# - Set EMAIL_PASS to your App Password (not regular password)
# - You MUST enable 2-Step Verification in your Google Account
# - App Passwords are 16 characters with no spaces
#
# OUTLOOK SETUP:
# - Set EMAIL_SERVICE=outlook
# - Set EMAIL_USER to your Outlook/Hotmail address
# - Set EMAIL_PASS to your password (or App Password if using 2FA)
# - Outlook uses different SMTP settings handled automatically by the app
#   (host: 'smtp-mail.outlook.com', port: 587, secure: false)

# =================================================================
# ALTERNATIVE ENVIRONMENT SETUP METHOD
# =================================================================
# Instead of a single .env file, you can use two separate files:
#
# .env.development - Used when running 'npm run dev'
# Contains:
#   PORT=3000
#   (No EMAIL_* variables needed for development)
#
# .env.production - Used when running 'npm run start'
# Contains:
#   PORT=3000
#   EMAIL_SERVICE=gmail
#   EMAIL_USER=your-email@gmail.com
#   EMAIL_PASS=your-app-password
#   EMAIL_RECIPIENT=recipient@example.com
#
# You would need to modify server.js to load the correct file:
# ```
# const env = process.env.NODE_ENV || 'development'
# dotenv.config({ path: `.env.${env}` })
# ```

# =================================================================
# HOW IT WORKS
# =================================================================
# When NODE_ENV=development:
#  - Emails are caught by Ethereal
#  - No real emails are sent
#  - You'll get a preview URL in the console
#
# When NODE_ENV=production:
#  - Real emails are sent via Gmail/Outlook
#  - EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS must be set
#  - Recipient will receive the actual email

# =================================================================
# EXAMPLE CONFIGURATIONS (COMMENTED OUT)
# =================================================================
# Gmail Example:
# EMAIL_SERVICE=gmail
# EMAIL_USER=your-gmail@gmail.com
# EMAIL_PASS=abcdefghijklmnop  # 16-character App Password
# EMAIL_RECIPIENT=recipient@example.com

# Outlook Example:
# EMAIL_SERVICE=outlook
# EMAIL_USER=your-outlook@hotmail.com
# EMAIL_PASS=YourOutlookPassword  # Regular password or App Password if using 2FA
# EMAIL_RECIPIENT=recipient@example.com