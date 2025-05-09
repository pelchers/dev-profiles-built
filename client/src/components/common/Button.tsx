import React from 'react';
import { Link } from 'react-router-dom';

type ButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButtonProps = ButtonBaseProps & 
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type ButtonAsLinkProps = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: typeof Link;
    to: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const Button = ({ children, className = '', as: Component = 'button', ...props }: ButtonProps) => {
  const baseStyles = `
    bg-arcade-green text-black
    py-2 px-6
    rounded-full
    font-bold
    transition-all duration-150
    shadow-[0_4px_0_0_#00CFFF]
    hover:shadow-[0_6px_0_0_#00CFFF] hover:translate-y-[-2px]
    active:shadow-[0_2px_0_0_#00CFFF] active:translate-y-[2px]
    focus:outline-none focus:ring-2 focus:ring-arcade-blue focus:ring-opacity-50
  `;

  return (
    <Component
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button; 