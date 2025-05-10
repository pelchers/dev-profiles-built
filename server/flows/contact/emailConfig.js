import nodemailer from 'nodemailer';

// Function to create email transporter based on service type
export async function createEmailTransporter() {
  // Add debug logging
  console.log('NODE_ENV value:', process.env.NODE_ENV);
  
  // Only use real email if explicitly in production mode
  if (process.env.NODE_ENV === 'production') {
    console.log('Using REAL email configuration (Gmail/Outlook)');
    // Production mode - use real email service
    const emailService = process.env.EMAIL_SERVICE?.toLowerCase() || 'gmail';
    
    if (emailService === 'outlook') {
      return nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Gmail configuration
      return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  } else {
    // Default to Ethereal for any other mode (development, undefined, etc.)
    console.log('Using ETHEREAL email for testing');
    const testAccount = await nodemailer.createTestAccount();
    console.log('Ethereal Test Account:', testAccount.user); // Log the test email for reference
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
} 