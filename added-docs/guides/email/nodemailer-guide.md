# Step-by-Step Guide: Implementing Contact Form with Nodemailer

This guide will walk you through implementing a complete contact form with Nodemailer (Option 3 from the email options).

## 1. Setup Directory Structure

Create these files:

```
/client
  /src
    /components
      /flows
        /contact
          ContactForm.tsx
          useContactForm.ts
    /types
      contact.ts

/server
  /flows
    /contact
      contactRoutes.ts
      contactController.ts
      emailConfig.ts
  /common
    /types
      contact.ts
```

## 2. Frontend Implementation

### Step 1: Define Contact Form Types

```typescript
// client/src/types/contact.ts
export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormState {
  loading: boolean;
  success: boolean | null;
  error: string | null;
}
```

### Step 2: Create Contact Form Hook

```typescript
// client/src/components/flows/contact/useContactForm.ts
import { useState } from 'react';
import { ContactFormInput, ContactFormState } from '../../../types/contact';

export function useContactForm() {
  const [formState, setFormState] = useState<ContactFormState>({
    loading: false,
    success: null,
    error: null
  });

  const sendEmail = async (form: ContactFormInput) => {
    setFormState({ loading: true, success: null, error: null });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setFormState({ loading: false, success: true, error: null });
    } catch (error) {
      console.error('Contact form error:', error);
      setFormState({ 
        loading: false, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send message'
      });
    }
  };

  return { sendEmail, formState };
}
```

### Step 3: Update Contact Form Component

```typescript
// client/src/components/flows/contact/ContactForm.tsx
import { useState } from 'react';
import { useContactForm } from './useContactForm';
import { ContactFormInput } from '../../../types/contact';
import BaseStyles from '../../../styles/BaseStyles';

const ContactForm = () => {
  const { sendEmail, formState } = useContactForm();
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEmail(formData);
    
    // Reset form if successful
    if (formState.success) {
      setFormData({ name: '', email: '', message: '' });
    }
  };
  
  return (
    <div>
      <h2 className={`${BaseStyles.heading2} mb-6`}>Send a Message</h2>
      
      {formState.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Thank you for your message. We will get back to you soon.
        </div>
      )}
      
      {formState.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {formState.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={BaseStyles.label}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={formState.loading}
            className={BaseStyles.input}
          />
        </div>
        
        <div>
          <label htmlFor="email" className={BaseStyles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={formState.loading}
            className={BaseStyles.input}
          />
        </div>
        
        <div>
          <label htmlFor="message" className={BaseStyles.label}>Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={formState.loading}
            rows={5}
            className={BaseStyles.textarea}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={formState.loading}
          className={`${BaseStyles.buttonAccent} ${formState.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {formState.loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
```

### Step 4: Update Contact Page

```typescript
// client/src/pages/Contact.tsx
import BaseStyles from '../styles/BaseStyles';
import ContactForm from '../components/flows/contact/ContactForm';

const Contact = () => {
  return (
    <main>
      {/* Contact Hero */}
      <section className={`bg-${BaseStyles.colors.background.secondary}`}>
        <div className={`${BaseStyles.container} ${BaseStyles.section}`}>
          <div className="max-w-3xl">
            <h1 className={`${BaseStyles.heading1} mb-6`}>
              Contact Us
            </h1>
            <p className={`${BaseStyles.paragraph}`}>
              Have a project in mind or want to learn more about our process?
              We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Form & Info */}
      <section className={BaseStyles.section}>
        <div className={BaseStyles.container}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />
            
            {/* Contact Information */}
            <div>
              <h2 className={`${BaseStyles.heading2} mb-6`}>
                Our Information
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className={`${BaseStyles.heading3} mb-3`}>Location</h3>
                  <address className={`not-italic ${BaseStyles.colors.text.secondary}`}>
                    <p>123 Design Street</p>
                    <p>Architecture City, AC 12345</p>
                  </address>
                </div>
                
                <div>
                  <h3 className={`${BaseStyles.heading3} mb-3`}>Contact</h3>
                  <p className={BaseStyles.colors.text.secondary}>contact@example.com</p>
                  <p className={BaseStyles.colors.text.secondary}>+1 (555) 123-4567</p>
                </div>
                
                <div>
                  <h3 className={`${BaseStyles.heading3} mb-3`}>Hours</h3>
                  <p className={BaseStyles.colors.text.secondary}>Monday–Friday: 9am–5pm</p>
                  <p className={BaseStyles.colors.text.secondary}>Saturday & Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
```

## 3. Backend Implementation

### Step 1: Backend Type Definition

```typescript
// server/common/types/contact.ts
export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export interface EmailServiceConfig {
  service: 'gmail' | 'outlook';
  host?: string;
  port?: number;
  secure?: boolean;
  user: string;
  pass: string;
}
```

### Step 2: Create Email Configuration Module

```typescript
// server/flows/contact/emailConfig.ts
import { EmailServiceConfig } from '../../common/types/contact';
import nodemailer from 'nodemailer';

// Function to create email transporter based on service type
export function createEmailTransporter() {
  // Determine which email service to use based on environment variable
  const emailService = process.env.EMAIL_SERVICE?.toLowerCase() || 'gmail';
  
  let config: EmailServiceConfig = {
    service: 'gmail', // Default to Gmail
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  };
  
  // Configure for different email providers
  if (emailService === 'outlook') {
    config = {
      service: 'outlook',
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || ''
    };
  }
  
  // Create and return the appropriate transporter
  if (config.service === 'outlook') {
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
  } else {
    // Gmail or other service with simpler config
    return nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
  }
}
```

### Step 3: Create Contact Controller

```typescript
// server/flows/contact/contactController.ts
import { Request, Response } from 'express';
import { ContactFormInput } from '../../common/types/contact';
import { createEmailTransporter } from './emailConfig';

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body as ContactFormInput;
    
    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create the appropriate email transporter
    const transporter = createEmailTransporter();
    
    // Email template
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      replyTo: email, // Makes replies go to the customer
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Log success (helpful for debugging)
    console.log(`Email sent from ${name} (${email})`);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

### Step 4: Create Contact Routes

```typescript
// server/flows/contact/contactRoutes.ts
import express from 'express';
import { sendEmail } from './contactController';

const router = express.Router();

// POST /api/contact - Send contact email
router.post('/', sendEmail);

export default router;
```

### Step 5: Update Server Entry Point

```typescript
// server/server.js (or server.ts)
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import contactRoutes from './flows/contact/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/contact', contactRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 4. Environment Setup

Create a `.env` file in your project root:

```
# Email Configuration
EMAIL_SERVICE=gmail  # or 'outlook'
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_RECIPIENT=where-to-receive@example.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 5. Gmail App Password Setup (if using Gmail)

1. Go to your Google Account: https://myaccount.google.com/
2. Select "Security"
3. Under "Signing in to Google," select "2-Step Verification"
4. At the bottom of the page, select "App passwords"
5. Generate a new app password for "Mail" and "Other (Custom name)"
6. Use this generated password in your .env file (EMAIL_PASS)

## 5.5 Outlook/Office 365 App Password Setup

1. Go to your Microsoft account: https://account.microsoft.com/
2. Navigate to "Security" > "Advanced security options"
3. Under "Additional security", ensure two-step verification is enabled
4. Return to the security page and select "App passwords"
5. Click "Create a new app password"
6. Enter a name for the app (e.g., "Nodemailer App")
7. Copy the generated password
8. Use this generated password in your .env file (EMAIL_PASS)

## 6. Testing

1. Start your server: `npm run dev` (or whatever your dev script is)
2. Navigate to your Contact page
3. Fill out the form and submit
4. Check for success/error messages
5. Verify the email was received at your configured address

## 7. Error Prevention Tips

1. Always validate inputs on both frontend and backend
2. Use environment variables for sensitive data
3. Implement rate limiting to prevent spam
4. Add detailed logging for troubleshooting
5. Test across multiple browsers and devices

## 8. Switching Between Email Providers

This implementation is designed to easily switch between email providers (Gmail and Outlook) based on a simple configuration change. Here's how to switch:

### Setting Up for Gmail

1. In your `.env` file, set:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

2. Make sure you've generated an App Password from your Google Account if you have 2-Step Verification enabled.

3. That's it! The system will automatically configure the correct SMTP settings for Gmail.

### Setting Up for Outlook/Office 365

1. In your `.env` file, change:
   ```
   EMAIL_SERVICE=outlook
   EMAIL_USER=your-outlook@outlook.com
   EMAIL_PASS=your-outlook-app-password
   ```

2. Make sure you've generated an App Password from your Microsoft Account if you have 2-Step Verification enabled.

3. The system will automatically configure the correct SMTP settings for Outlook.

### Supporting Other Email Providers

To support additional email providers beyond Gmail and Outlook:

1. Update the `EmailServiceConfig` interface in `server/common/types/contact.ts` to include your new provider:
   ```typescript
   export interface EmailServiceConfig {
     service: 'gmail' | 'outlook' | 'yahoo' | 'custom'; // Add your provider
     host?: string;
     port?: number;
     secure?: boolean;
     user: string;
     pass: string;
   }
   ```

2. Modify the `createEmailTransporter` function in `server/flows/contact/emailConfig.ts` to include the new provider's settings:
   ```typescript
   if (emailService === 'yahoo') {
     config = {
       service: 'yahoo',
       host: 'smtp.mail.yahoo.com',
       port: 465,
       secure: true,
       user: process.env.EMAIL_USER || '',
       pass: process.env.EMAIL_PASS || ''
     };
   }
   ```

3. Update your `.env` file with the new service name:
   ```
   EMAIL_SERVICE=yahoo
   ```

This modular approach allows you to easily switch between email providers without having to rewrite your email sending code.

This implementation provides a robust, error-resistant contact form that handles the entire flow from frontend to backend email delivery.
