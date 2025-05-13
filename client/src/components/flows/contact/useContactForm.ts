import { useState } from 'react';
import { ContactFormInput, ContactFormState } from '../../../types/contact';

// API base URL that adapts to the current environment
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api' 
  : '/api';

export function useContactForm() {
  const [formState, setFormState] = useState<ContactFormState>({
    loading: false,
    success: null,
    error: null
  });

  const sendEmail = async (form: ContactFormInput) => {
    // Validate form data
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormState({ 
        loading: false, 
        success: false, 
        error: 'All fields are required'
      });
      return false;
    }

    if (!validateEmail(form.email)) {
      setFormState({ 
        loading: false, 
        success: false, 
        error: 'Please enter a valid email address'
      });
      return false;
    }

    setFormState({ loading: true, success: null, error: null });
    
    try {
      console.log('Sending contact form data to:', `${API_BASE_URL}/contact`);
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      console.log('Contact form submission successful:', data);
      
      // If the response contains a preview URL (for test emails)
      if (data.previewUrl) {
        console.log('Test email preview URL:', data.previewUrl);
        window.open(data.previewUrl, '_blank');
      }
      
      setFormState({ loading: false, success: true, error: null });
      return true;
    } catch (error) {
      console.error('Contact form error:', error);
      setFormState({ 
        loading: false, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send message'
      });
      return false;
    }
  };

  // Simple email validation function
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  return { sendEmail, formState };
} 