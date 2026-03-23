'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { mapBackendError } from '@/lib/error-handler';

/**
 * ErrorState Component
 * Displays a premium error state with recovery actions.
 */
export function ErrorState({
  error,
  title,
  description,
  onRetry,
  className,
  variant = 'default', // 'default' | 'card'
}) {
  const mapped = mapBackendError(error);
  const finalTitle = title || mapped?.title || 'An error occurred';
  const finalDesc = description || mapped?.message || 'We could not complete your request.';

  return (
    <div
      className={cn(
        'animate-in fade-in zoom-in-95 flex flex-col items-center justify-center p-8 text-center duration-500',
        variant === 'card' &&
          'rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm shadow-sm',
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 scale-150 rounded-full bg-rose-50 opacity-60 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] border border-rose-100 bg-white shadow-xl shadow-rose-500/10">
          <AlertCircle className="h-10 w-10 text-rose-500" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="mb-2 text-xl font-bold text-slate-900 tracking-tight">{finalTitle}</h3>
      <p className="mx-auto max-w-[320px] text-sm leading-relaxed text-slate-500 mb-8">
        {finalDesc}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="group h-12 rounded-full border-none bg-rose-600 px-8 font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
        >
          <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
          Try Again
        </Button>
      )}
    </div>
  );
}
