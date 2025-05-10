import React from 'react';
import ContactForm from '../components/flows/contact/ContactForm';

const Contact = () => {
  return (
    <main>
      {/* Contact Hero */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Have a project in mind or want to learn more about our process?
              We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Form & Info */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-black">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Our Information
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">Location</h3>
                  <address className="not-italic text-black">
                    <p>123 Design Street</p>
                    <p>Architecture City, AC 12345</p>
                  </address>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Contact</h3>
                  <p className="text-black">contact@example.com</p>
                  <p className="text-black">+1 (555) 123-4567</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Hours</h3>
                  <p className="text-black">Monday–Friday: 9am–5pm</p>
                  <p className="text-black">Saturday & Sunday: Closed</p>
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