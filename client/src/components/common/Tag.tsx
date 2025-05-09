import React from 'react';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  colorClass?: string; // e.g., bg-indigo-400, bg-green-400
}

const Tag: React.FC<TagProps> = ({ children, className = '', colorClass = 'bg-arcade-green', ...props }) => (
  <span
    className={`inline-block px-3 py-1 text-sm font-medium rounded-full text-white ${colorClass} ${className}`}
    {...props}
  >
    {children}
  </span>
);

export default Tag; 