import React from 'react';
import { cn } from '@/lib/utils';

export interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  id?: string;
  isFullWidth?: boolean;
}

export type InputProps = BaseInputProps &
  (
    | ({ as?: 'input' } & React.InputHTMLAttributes<HTMLInputElement>)
    | ({ as: 'textarea'; rows?: number } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      label,
      error,
      helperText,
      id,
      className,
      isFullWidth = true,
      as = 'input',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const baseControlStyles = cn(
      'w-full px-4 py-2.5 text-sm text-[#2C2C2C] bg-white border transition-colors duration-150',
      'placeholder:text-stone-400 focus:outline-none focus:ring-1',
      error
        ? 'border-[#C75050] focus:border-[#C75050] focus:ring-[#C75050]'
        : 'border-stone-300 hover:border-stone-400 focus:border-[#B8956A] focus:ring-[#B8956A]',
      'disabled:bg-stone-100 disabled:cursor-not-allowed rounded-none',
      className
    );

    return (
      <div className={cn('flex flex-col gap-1.5', isFullWidth ? 'w-full' : '')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[#3D3229]"
          >
            {label}
            {props.required && <span className="text-[#C75050] ml-1">*</span>}
          </label>
        )}

        {as === 'textarea' ? (
          <textarea
            id={inputId}
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={cn(baseControlStyles, 'min-h-[100px] resize-y')}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={baseControlStyles}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {error && (
          <p className="text-xs text-[#C75050] font-medium flex items-center gap-1">
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
