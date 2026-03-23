'use client';

import { Check } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/cn';

function Checkbox({ className, checked, indeterminate, onCheckedChange, disabled, ...props }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : !!checked}
      disabled={disabled}
      data-slot="checkbox"
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange?.(!checked);
      }}
      className={cn(
        'inline-flex size-4 items-center justify-center rounded-md border transition-all duration-200 shadow-sm',
        checked || indeterminate
          ? 'border-primary bg-primary text-white scale-105 shadow-md shadow-primary/20'
          : 'border-slate-300 bg-white hover:border-primary/50 hover:bg-slate-50',
        disabled ? 'cursor-not-allowed opacity-30 grayscale' : 'cursor-pointer',
        className
      )}
      {...props}
    >
      {checked && !indeterminate ? (
        <Check className="size-3.5 stroke-[4px] drop-shadow-sm" />
      ) : indeterminate ? (
        <div className="bg-white size-2.5 rounded-sm" />
      ) : null}
    </button>
  );
}

export { Checkbox };
