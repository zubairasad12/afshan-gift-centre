import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'image' | 'card' | 'productCard' | 'circle';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const customStyles: React.CSSProperties = {
    ...style,
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  if (variant === 'productCard') {
    return (
      <div className={cn('flex flex-col gap-3 w-full animate-pulse', className)} {...props}>
        <div className="w-full aspect-[3/4] bg-stone-200" />
        <div className="h-4 bg-stone-200 w-3/4" />
        <div className="h-3 bg-stone-200 w-1/2" />
        <div className="h-4 bg-stone-200 w-1/3 mt-1" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('p-4 border border-stone-200 bg-white space-y-4 animate-pulse', className)} {...props}>
        <div className="w-full h-48 bg-stone-200" />
        <div className="h-4 bg-stone-200 w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-stone-200 w-full" />
          <div className="h-3 bg-stone-200 w-5/6" />
        </div>
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div
        className={cn('w-full h-full bg-stone-200 animate-pulse', className)}
        style={customStyles}
        {...props}
      />
    );
  }

  if (variant === 'circle') {
    return (
      <div
        className={cn('rounded-full bg-stone-200 animate-pulse shrink-0', className)}
        style={customStyles}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn('h-4 bg-stone-200 animate-pulse', className)}
      style={customStyles}
      {...props}
    />
  );
};

export default Skeleton;
