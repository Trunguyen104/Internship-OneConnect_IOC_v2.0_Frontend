'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/cn';

function Spinner({ className, ...props }) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
