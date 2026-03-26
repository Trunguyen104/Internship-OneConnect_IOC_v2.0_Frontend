'use client';

import { Tag } from 'antd';
import React from 'react';

import { cn } from '@/lib/cn';

const VARIANT_MAP = {
  default: 'border-slate-200 bg-slate-100 text-slate-700',
  primary: 'border-primary/20 bg-primary-surface text-primary',
  success: 'border-success/20 bg-success-surface text-success',
  warning: 'border-warning/20 bg-warning-surface text-warning-text',
  danger: 'border-danger/20 bg-danger-surface text-danger',
  info: 'border-info/20 bg-info-surface text-info',
  // Solid variants
  'success-solid': 'border-transparent bg-success text-white',
  'primary-solid': 'border-transparent bg-primary text-white',
  'warning-solid': 'border-transparent bg-warning text-white',
};

const SIZE_MAP = {
  sm: 'text-[10px] px-2 py-0',
  md: 'text-[11px] px-2.5 py-0.5',
  lg: 'text-xs px-3 py-1',
};

const Badge = ({ children, variant = 'default', size = 'md', className = '', icon }) => {
  const variantStyles = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const sizeStyles = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <Tag
      icon={icon}
      className={cn(
        'm-0 inline-flex items-center rounded-full border font-bold uppercase tracking-wider',
        variantStyles,
        sizeStyles,
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Badge;
