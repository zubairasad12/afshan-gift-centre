import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sale' | 'new' | 'sold-out' | 'custom' | 'accent';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'custom',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    sale: 'bg-[#C75050] text-white',
    new: 'bg-[#5A7A60] text-white',
    'sold-out': 'bg-stone-500 text-white',
    accent: 'bg-[#B8956A] text-white',
    custom: 'bg-[#F5F0EB] text-[#3D3229] border border-stone-200',
  };

  const sizeStyles = {
    sm: 'text-[10px] font-semibold px-2 py-0.5 tracking-wider uppercase',
    md: 'text-xs font-semibold px-2.5 py-1 tracking-wider uppercase',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium leading-none select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
