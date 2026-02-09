'use client';

import { useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export default function Input({ label, error, className = '', type, showToggle = true, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password' && showToggle;

  return (
    <div className='mb-4'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>
        {label} <span className='text-red-500'>*</span>
      </label>

      <div className='relative'>
        <input
          {...props}
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full px-4 py-2 rounded-2xl
            bg-white text-gray-900
            border
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isPassword ? 'pr-10' : ''}
            ${className}
          `}
        />

        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        )}

        {error && <span className='text-xs text-red-600 mt-1 block'>{error}</span>}
      </div>
    </div>
  );
}
