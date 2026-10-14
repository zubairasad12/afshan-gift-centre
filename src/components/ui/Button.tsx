import React from 'react';
import { cn } from '@/lib/utils';
import Spinner from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      disabled,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-none';

    const variantStyles = {
      primary:
        'bg-[#2C2C2C] text-white hover:bg-black active:bg-neutral-900 focus:ring-stone-600 shadow-sm',
      secondary:
        'border border-[#2C2C2C] text-[#2C2C2C] bg-transparent hover:bg-[#F5F0EB] active:bg-[#EBE3D9] focus:ring-stone-400',
      accent:
        'bg-[#B8956A] text-white hover:bg-[#A07F56] active:bg-[#8C6E48] focus:ring-[#B8956A] shadow-sm',
      ghost:
        'text-[#3D3229] hover:bg-[#F5F0EB] active:bg-[#EBE3D9] focus:ring-stone-300',
      danger:
        'bg-[#C75050] text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-400 shadow-sm',
    };

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 tracking-wider uppercase font-semibold',
      md: 'text-sm px-6 py-3 gap-2 tracking-wide uppercase font-semibold',
      lg: 'text-base px-8 py-4 gap-2.5 tracking-wider uppercase font-semibold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isFullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading && (
          <Spinner
            size={size === 'sm' ? 'sm' : 'md'}
            className="mr-2 text-current"
          />
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
