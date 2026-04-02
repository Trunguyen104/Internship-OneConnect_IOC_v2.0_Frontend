'use client';

import { Input as AntdInput } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import { cn } from '@/lib/cn';

const Input = React.forwardRef(({ className, type = 'text', label, error, ...props }, ref) => {
  const isPassword = type === 'password';
  const inputId = props.id || props.name || label;

  const InputComponent = isPassword ? AntdInput.Password : AntdInput;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <InputComponent
        {...props}
        id={inputId}
        type={type}
        ref={ref}
        status={error ? 'error' : ''}
        className={cn(
          'h-10 w-full rounded-md border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400',
          'transition-all focus:shadow-none',
          className
        )}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.node,
  error: PropTypes.node,
  required: PropTypes.bool,
};

export { Input };
export default Input;
