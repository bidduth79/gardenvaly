/**
 * @file Button.tsx
 * @description Botanical-themed reusable button component.
 */

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174D35]';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 shadow-xs',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 shadow-sm',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[#174D35] hover:bg-[#123e2a] text-white active:scale-[0.98]',
    secondary: 'bg-[#5C8D50] hover:bg-[#4b7541] text-white active:scale-[0.98]',
    outline: 'border border-[#174D35] text-[#174D35] hover:bg-[#174D35]/5 bg-transparent',
    ghost: 'text-[#174D35] hover:bg-[#174D35]/10 bg-transparent',
    gold: 'bg-[#C5A059] hover:bg-[#b08d47] text-white active:scale-[0.98]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
