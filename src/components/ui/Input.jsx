'use client';

import React from 'react';
import { cn } from '@/lib/cn';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className='flex w-full flex-col gap-1.5'>
      {label && (
        <label className='text-sm font-medium text-slate-700'>
          {label}
        </label>
      )}
      <input
        type={type}
        data-slot='input'
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-slate-400',
          'focus-visible:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-600)]/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && (
        <p className='text-xs font-medium text-red-500'>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
