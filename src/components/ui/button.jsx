'use client';

import React from 'react';
import { cn } from '@/lib/cn';

const VARIANT = {
  default: 'bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)]',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700',
  destructive: 'bg-rose-600 text-white hover:bg-rose-700',
  link: 'bg-transparent text-[var(--primary-600)] underline-offset-4 hover:underline',
};

const SIZE = {
  default: 'h-9 px-4 text-sm',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-10 px-6 text-sm',
  xs: 'h-7 px-2 text-xs',
  icon: 'h-9 w-9',
  'icon-sm': 'h-8 w-8',
  'icon-xs': 'h-6 w-6',
  'icon-lg': 'h-10 w-10',
};

function Button({ className, variant = 'default', size = 'default', type = 'button', ...props }) {
  return (
    <button
      type={type}
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANT[variant] || VARIANT.default,
        SIZE[size] || SIZE.default,
        className,
      )}
      {...props}
    />
  );
}

export { Button };

