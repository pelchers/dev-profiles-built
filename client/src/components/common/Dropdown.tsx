import React from 'react';
import { Link } from 'react-router-dom';

type DropdownItemProps = {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

const DropdownItem: React.FC<DropdownItemProps> = ({ to, onClick, children, className = '' }) => {
  const baseStyles = `
    block px-4 py-2 text-black
    transition-all duration-150
    hover:bg-arcade-green/10 hover:text-black
    active:bg-arcade-green/20
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={baseStyles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseStyles} onClick={onClick}>
      {children}
    </button>
  );
};

type DropdownProps = {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
};

const Dropdown: React.FC<DropdownProps> = ({ children, className = '', align = 'left' }) => {
  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div 
      className={`
        absolute top-full mt-2 
        ${alignmentClasses[align]}
        min-w-[200px]
        bg-white 
        rounded-lg
        shadow-[0_4px_0_0_#00CFFF]
        border border-arcade-blue/20
        overflow-hidden
        z-50
        animate-fadeIn
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export { Dropdown, DropdownItem }; 