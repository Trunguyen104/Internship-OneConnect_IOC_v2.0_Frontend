'use client';

import React from 'react';
import { cn } from '@/lib/cn';

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
        'placeholder:text-slate-400',
        'focus-visible:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-600)]/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

