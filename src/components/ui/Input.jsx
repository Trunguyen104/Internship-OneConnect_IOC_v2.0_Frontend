'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/cn';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Input = React.forwardRef(({ className, type = 'text', label, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputId = props.id || props.name || label;

  return (
    <div className='flex w-full flex-col gap-1.5'>
      {label && (
        <label htmlFor={inputId} className='text-sm font-medium text-slate-700'>
          {label} {props.required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <div className='relative'>
        <input
          {...props}
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          data-slot='input'
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
            'placeholder:text-slate-400',
            'focus-visible:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-600)]/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isPassword && 'pr-10',
            error && 'border-red-500 focus-visible:ring-red-500/20',
            className
          )}
        />
        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-slate-700'
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        )}
      </div>
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
