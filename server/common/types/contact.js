// Remove TypeScript interfaces and export simple object schema for reference
export const ContactFormSchema = {
  name: 'string',
  email: 'string',
  message: 'string'
};

export const EmailServiceConfig = {
  service: 'string', // 'gmail' or 'outlook'
  host: 'string?',
  port: 'number?',
  secure: 'boolean?',
  user: 'string',
  pass: 'string'
}; 