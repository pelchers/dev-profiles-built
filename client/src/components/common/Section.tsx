import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '', ...props }) => (
  <section
    className={`max-w-screen-lg mx-auto w-full p-4 md:p-8 space-y-6 ${className}`}
    {...props}
  >
    {children}
  </section>
);

export default Section; 