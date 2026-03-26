'use client';

import React from 'react';

import { cn } from '@/lib/cn';

const VARIANT_MAP = {
  default: 'border-slate-200 bg-slate-100 text-slate-700',
  primary: 'border-primary bg-primary text-white', // Use solid by default for primary
  success: 'border-success bg-success text-white', // Use solid by default for success
  warning: 'border-warning bg-warning text-white', // Use solid by default for warning
  danger: 'border-error bg-error text-white',
  info: 'border-info bg-info text-white',
  // Soft variants
  'primary-soft': 'border-primary/20 bg-primary-surface text-primary',
  'success-soft': 'border-success/20 bg-success-surface text-success',
  'warning-soft': 'border-warning/20 bg-warning-surface text-warning-text',
  'info-soft': 'border-info/20 bg-info-surface text-info',
};

const SIZE_MAP = {
  xs: 'text-[9px] px-1.5 h-4 leading-none font-medium normal-case tracking-normal',
  sm: 'text-[10px] px-2 py-0 font-bold uppercase tracking-wider',
  md: 'text-[11px] px-2.5 py-0.5 font-bold uppercase tracking-wider',
  lg: 'text-xs px-3 py-1 font-bold uppercase tracking-wider',
};

const Badge = ({ children, variant = 'default', size = 'md', className = '', icon }) => {
  const variantStyles = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const sizeStyles = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border',
        variantStyles,
        sizeStyles,
        className
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
