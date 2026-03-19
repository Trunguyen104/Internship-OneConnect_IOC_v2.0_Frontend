'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const SheetCtx = createContext(null);

function Sheet({ open, onOpenChange, children }) {
  const value = useMemo(() => ({ open: !!open, onOpenChange }), [open, onOpenChange]);
  return <SheetCtx.Provider value={value}>{children}</SheetCtx.Provider>;
}

function useSheet() {
  const ctx = useContext(SheetCtx);
  if (!ctx) throw new Error('Sheet components must be used within <Sheet>');
  return ctx;
}

function SheetContent({
  className = '',
  side = 'right',
  children,
  showCloseButton = true,
  ...props
}) {
  const { open, onOpenChange } = useSheet();

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  const sideClass = side === 'left' ? 'left-0' : side === 'right' ? 'right-0' : 'right-0';

  return createPortal(
    <>
      <div
        data-slot='sheet-overlay'
        className='fixed inset-0 z-50 bg-black/40'
        onMouseDown={() => onOpenChange?.(false)}
      />
      <div
        data-slot='sheet-content'
        role='dialog'
        aria-modal='true'
        className={cn(
          'fixed top-0 z-50 h-full w-full max-w-[520px] border-l border-slate-100 bg-white shadow-2xl',
          sideClass,
          'animate-in duration-200',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <button
            type='button'
            aria-label='Close'
            onClick={() => onOpenChange?.(false)}
            className='absolute top-4 right-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          >
            <X className='size-4' />
          </button>
        ) : null}
      </div>
    </>,
    document.body,
  );
}

function SheetHeader({ className = '', ...props }) {
  return <div data-slot='sheet-header' className={cn('space-y-2', className)} {...props} />;
}

function SheetTitle({ className = '', ...props }) {
  return (
    <div
      data-slot='sheet-title'
      className={cn('text-2xl font-semibold text-slate-900', className)}
      {...props}
    />
  );
}

function SheetDescription({ className = '', ...props }) {
  return (
    <div
      data-slot='sheet-description'
      className={cn('text-sm text-slate-500', className)}
      {...props}
    />
  );
}

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription };
