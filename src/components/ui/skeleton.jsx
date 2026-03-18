'use client';

import { cn } from '@/lib/cn';

function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded bg-slate-100', className)} {...props} />;
}

export { Skeleton };
