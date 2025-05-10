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
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
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

  return { sendEmail, formState };
} 