'use client';

import React from 'react';

import { cn } from '@/lib/cn';

function FieldGroup({ className = '', ...props }) {
  return (
    <div
      data-slot="field-group"
      className={cn('flex w-full flex-col gap-4', className)}
      {...props}
    />
  );
}

function Field({ className = '', orientation = 'vertical', ...props }) {
  const base =
    orientation === 'horizontal' ? 'flex flex-row items-start gap-3' : 'flex flex-col gap-1';
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(base, className)}
      {...props}
    />
  );
}

function FieldLabel({ className = '', ...props }) {
  return (
    <label
      data-slot="field-label"
      className={cn('text-sm font-medium text-slate-700', className)}
      {...props}
    />
  );
}

function FieldContent({ className = '', ...props }) {
  return (
    <div
      data-slot="field-content"
      className={cn('flex flex-1 flex-col gap-1.5', className)}
      {...props}
    />
  );
}

function FieldDescription({ className = '', ...props }) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-xs text-slate-500', className)}
      {...props}
    />
  );
}

export { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel };
