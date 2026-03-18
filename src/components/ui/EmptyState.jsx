'use client';

import { cn } from '@/lib/cn';
import { PackageOpen } from 'lucide-react';

export function EmptyState({ 
  title = 'No records found', 
  description = 'Try adjusting your search or filters to find what you are looking for.',
  className 
}) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-500',
      className
    )}>
      <div className='relative mb-4'>
        <div className='absolute inset-0 scale-150 blur-2xl bg-slate-100 rounded-full opacity-50' />
        <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100'>
          <PackageOpen className='h-8 w-8 text-slate-300' strokeWidth={1.5} />
        </div>
      </div>
      <h3 className='text-base font-bold text-slate-900 mb-1'>{title}</h3>
      <p className='text-sm text-slate-500 max-w-[280px] leading-relaxed mx-auto'>
        {description}
      </p>
    </div>
  );
}
