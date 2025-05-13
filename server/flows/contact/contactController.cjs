const { Request, Response } = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

/**
 * Sends an email from the contact form
 */
const sendEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Force production mode in the 'start' command
    // When running with npm start, we always want real emails even if NODE_ENV is undefined
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.NODE_ENV === undefined || 
                        process.argv.includes('server/server.cjs');
    
    // Debug logging
    console.log('Environment detection:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Is production mode:', isProduction);
    console.log('- Command args:', process.argv.slice(0, 3));
    
    // Hardcoded email credentials since env vars aren't loading properly
    const emailCredentials = {
      user: 'pelycluk@gmail.com',
      pass: 'dtiylwsaqmspimfd',
      recipient: 'pelycluk@gmail.com'
    };
    
    console.log('Email config:', {
      service: 'gmail',
      user: emailCredentials.user.substring(0, 3) + '...',
      pass: '******',
      recipient: emailCredentials.recipient.substring(0, 3) + '...'
    });

    // Use real email if in production mode
    if (isProduction) {
      console.log('Using REAL email with Gmail (hardcoded credentials)');
      
      // Configure transporter with Gmail settings for production
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: emailCredentials.user,
          pass: emailCredentials.pass,
        },
      });

      // Verify transporter configuration
      try {
        await transporter.verify();
        console.log('Email transporter verification successful');
      } catch (verifyError) {
        console.error('Email transporter verification failed:', verifyError);
        return res.status(500).json({ error: 'Email service misconfigured', details: verifyError.message });
      }

      // Email options
      const mailOptions = {
        from: `"Dev Profiles Contact Form" <${emailCredentials.user}>`,
        to: emailCredentials.recipient,
        subject: `New Contact Form Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<h3>New Contact Form Submission</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log('Real email sent successfully:', info.messageId);
      
      return res.status(200).json({ 
        success: true,
        message: 'Email sent successfully'
      });
    } 
    // Use Ethereal for testing in development mode
    else {
      console.log('Using ETHEREAL email for testing');
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
      
      const info = await testTransporter.sendMail({
        from: `"Contact Form Test" <${testAccount.user}>`,
        to: testAccount.user,
        subject: `Test: New Contact Form Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<h3>Test Contact Form Submission</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`,
      });
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Test email sent. Preview URL:', previewUrl);
      
      return res.status(200).json({ 
        success: true,
        message: 'Test email sent (development mode)',
        previewUrl: previewUrl
      });
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { sendEmail }; 