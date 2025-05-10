# HTML Email Styling Guide

This guide provides best practices and styling tips for creating HTML emails, particularly when using the `mailto:` form approach or designing custom email templates.

## Understanding the Mailto Form

When using the `mailto:` form approach (as in our SimpleContact.tsx):

1. The form opens the user's default email client when submitted
2. Field contents are sent as plain text in the email body in name=value format
3. The email is pre-addressed to your specified email address
4. User must still manually send the email from their client

Example:
```html
<form action="mailto:your.email@example.com" method="POST" encType="text/plain">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>
```

## HTML Email Design Principles

HTML emails require a different approach than web design:

### 1. Use Tables for Layout (Not Divs)

```html
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="50%">Left content</td>
    <td width="50%">Right content</td>
  </tr>
</table>
```

### 2. Inline CSS (No External Stylesheets)

```html
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
  This is my paragraph with inline styles.
</p>
```

### 3. Use Web-Safe Fonts

- Arial, Verdana, Georgia, Times New Roman
- Always include fallbacks: `font-family: Arial, Helvetica, sans-serif;`

### 4. Simple Color Schemes

- Use web-safe colors or simple hex codes
- Avoid gradients and complex color effects
- Test on dark and light mode email clients

## Style Themes for HTML Emails

Here are some email style approaches based on our existing style guides:

### Architectural Style

```html
<table style="width: 100%; max-width: 600px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
  <tr>
    <td style="background-color: #f7f7f7; padding: 20px;">
      <h1 style="color: #2c3e50; font-weight: 300; margin-bottom: 20px;">Clean Lines & Structure</h1>
      <p style="line-height: 1.5;">
        Thank you for your inquiry. We'll respond with professional precision.
      </p>
    </td>
  </tr>
</table>
```

### Mid-Century Modern

```html
<table style="width: 100%; max-width: 600px; font-family: 'Futura', 'Century Gothic', Arial, sans-serif; color: #333333;">
  <tr>
    <td style="background-color: #ffffff; padding: 20px; border-left: 4px solid #e67e22;">
      <h1 style="color: #e67e22; font-weight: 500;">Bold & Functional</h1>
      <p style="line-height: 1.5;">
        We appreciate your message and will be in touch shortly.
      </p>
    </td>
  </tr>
</table>
```

### Contemporary

```html
<table style="width: 100%; max-width: 600px; font-family: 'Roboto', Arial, sans-serif; color: #333333;">
  <tr>
    <td style="background-color: #ffffff; padding: 20px; border-top: 3px solid #3498db;">
      <h1 style="color: #3498db; font-weight: 300;">Sleek & Minimal</h1>
      <p style="line-height: 1.5;">
        Thank you for reaching out. Our team will contact you soon.
      </p>
    </td>
  </tr>
</table>
```

## Setting Up Styled Auto-Responses

For professional auto-responses to form submissions:

1. **Setup Email Auto-Responder**:
   - In Gmail: Settings > Filters and Blocked Addresses > Create new filter
   - In Outlook: Rules > New Rule > Apply to messages with specific words
   
2. **Create HTML Email Template**:
   - Use a service like [MJML](https://mjml.io/) to create responsive emails
   - Test with [Litmus](https://www.litmus.com/) or [Email on Acid](https://www.emailonacid.com/)

3. **Example Auto-Response Template**:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Thank You for Your Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background-color: #f7f7f7;">
        <img src="https://example.com/logo.png" alt="Company Logo" width="200" style="display: block; margin: 0 auto;">
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px; background-color: #ffffff;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="color: #153643; font-weight: bold; font-size: 24px; margin-bottom: 20px;">
              Thank you for contacting us!
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; color: #153643; font-size: 16px; line-height: 24px;">
              <p>We have received your message and will get back to you within 24-48 hours.</p>
              <p>In the meantime, feel free to browse our portfolio or check out our services.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 0 auto;">
                <tr>
                  <td style="background-color: #2c3e50; padding: 10px 25px; border-radius: 4px; text-align: center;">
                    <a href="https://example.com/portfolio" style="color: #ffffff; text-decoration: none; font-weight: bold;">View Portfolio</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #2c3e50; color: #ffffff; text-align: center;">
        <p style="margin: 0; font-size: 14px;">© 2023 Your Company Name</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">
          <a href="https://example.com" style="color: #ffffff; text-decoration: underline;">Website</a> | 
          <a href="tel:+11234567890" style="color: #ffffff; text-decoration: underline;">123-456-7890</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Limitations and Alternatives

The `mailto:` approach has several limitations:

1. No control over email formatting once it opens in client
2. Requires user to have an email client configured
3. User must manually send the email
4. Can't track submissions or confirmations

For more robust solutions:
- Consider EmailJS (frontend-only API approach)
- Use server-side email handling with Nodemailer
- See our Nodemailer guide for implementing a complete solution

## Testing Email Templates

Always test your HTML emails across:
- Different email clients (Gmail, Outlook, Apple Mail)
- Mobile devices and desktop
- Dark mode and light mode

Use services like Litmus or HTML Email Check to validate your templates. 