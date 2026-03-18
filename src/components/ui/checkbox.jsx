'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

function Checkbox({ className, checked, onCheckedChange, disabled, ...props }) {
  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={!!checked}
      disabled={disabled}
      data-slot='checkbox'
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'inline-flex size-4 items-center justify-center rounded-[4px] border border-slate-300 bg-white shadow-xs',
        'text-white transition-colors',
        checked ? 'border-[var(--primary-600)] bg-[var(--primary-600)]' : 'hover:bg-slate-50',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        className,
      )}
      {...props}
    >
      {checked ? <Check className='size-3.5' /> : null}
    </button>
  );
}

export { Checkbox };

