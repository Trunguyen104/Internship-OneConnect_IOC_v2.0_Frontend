'use client';

import React from 'react';

import { cn } from '@/lib/cn';

const VARIANT = {
  default: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700',
  destructive: 'bg-danger text-white hover:bg-primary-600',
  link: 'bg-transparent text-primary underline-offset-4 hover:underline',
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

function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  loading = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANT[variant] || VARIANT.default,
        SIZE[size] || SIZE.default,
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export { Button };
