'use client';

import { cn } from '@/lib/cn';
import { PackageOpen } from 'lucide-react';

export function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  className,
}) {
  return (
    <div
      className={cn(
        'animate-in fade-in zoom-in-95 flex flex-col items-center justify-center px-4 py-20 text-center duration-500',
        className,
      )}
    >
      <div className='relative mb-4'>
        <div className='absolute inset-0 scale-150 rounded-full bg-slate-100 opacity-50 blur-2xl' />
        <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm'>
          <PackageOpen className='h-8 w-8 text-slate-300' strokeWidth={1.5} />
        </div>
      </div>
      <h3 className='mb-1 text-base font-bold text-slate-900'>{title}</h3>
      <p className='mx-auto max-w-[280px] text-sm leading-relaxed text-slate-500'>{description}</p>
    </div>
  );
}
