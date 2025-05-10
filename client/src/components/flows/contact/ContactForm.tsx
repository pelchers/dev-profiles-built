import React, { useState } from 'react';
import { useContactForm } from './useContactForm';
import { ContactFormInput } from '../../../types/contact';

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
    const success = await sendEmail(formData);
    
    // Reset form if successful
    if (success) {
      setFormData({ name: '', email: '', message: '' });
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-black mb-6">Send a Message</h2>
      
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
      
      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={formState.loading}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={formState.loading}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-black mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={formState.loading}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={formState.loading}
          className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${formState.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {formState.loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 