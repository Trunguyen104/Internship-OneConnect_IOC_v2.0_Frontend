'use client';

import React from 'react';

import { Input } from '@/components/ui/input';
import { Select as CustomSelect } from '@/components/ui/select';

/**
 * Shared UI Components for Task/Backlog Modals
 */

export function FieldLabel({ required, children }) {
  return (
    <div className="mb-[6px] text-sm font-semibold text-gray-800">
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </div>
  );
}

export function Select({ value, onChange, options = [], placeholder = 'Select' }) {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full"
      options={options}
    />
  );
}

export function TextInput({ value, onChange, placeholder = '', ...props }) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="h-11 rounded-2xl"
      {...props}
    />
  );
}
