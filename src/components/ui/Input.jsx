'use client';

import { useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export default function Input({ label, error, className = '', type, showToggle = true, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password' && showToggle;

  const inputId = props.id || props.name || label;

  return (
    <div className='mb-4'>
      <label htmlFor={inputId} className='mb-2 block text-sm font-medium text-gray-900'>
        {label} <span className='text-red-500'>*</span>
      </label>

      <div className='relative'>
        <input
          {...props}
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full rounded-2xl border bg-white px-4 py-2 text-gray-900 ${error ? 'border-red-500' : 'border-gray-300'} ${isPassword ? 'pr-10' : ''} ${className}`}
        />

        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500'
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        )}

        {error && <span className='mt-1 block text-xs text-red-600'>{error}</span>}
      </div>
    </div>
  );
}
