import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-[#FAFAFA] border border-arcade-green rounded-lg shadow-[0_0_8px_#fff] hover:shadow-[0_0_16px_2px_#fff] transition-shadow duration-200 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card; 