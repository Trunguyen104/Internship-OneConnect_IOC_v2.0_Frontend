'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const DialogCtx = createContext(null);

function Dialog({ open, onOpenChange, children }) {
  const value = useMemo(() => ({ open: !!open, onOpenChange }), [open, onOpenChange]);
  return <DialogCtx.Provider value={value}>{children}</DialogCtx.Provider>;
}

function useDialog() {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>');
  return ctx;
}

function DialogTrigger({ asChild = false, children }) {
  const { onOpenChange } = useDialog();
  const child = React.Children.only(children);

  const props = {
    onClick: (e) => {
      child.props?.onClick?.(e);
      onOpenChange?.(true);
    },
  };

  return asChild ? (
    React.cloneElement(child, props)
  ) : (
    <button type='button' {...props}>
      {children}
    </button>
  );
}

function DialogClose({ asChild = false, children }) {
  const { onOpenChange } = useDialog();
  const child = React.Children.only(children);

  const props = {
    onClick: (e) => {
      child.props?.onClick?.(e);
      onOpenChange?.(false);
    },
  };

  return asChild ? (
    React.cloneElement(child, props)
  ) : (
    <button type='button' {...props}>
      {children}
    </button>
  );
}

function DialogOverlay({ className = '', ...props }) {
  return (
    <div
      data-slot='dialog-overlay'
      className={cn('fixed inset-0 z-50 bg-black/50', className)}
      {...props}
    />
  );
}

function DialogContent({ className = '', children, showCloseButton = true, ...props }) {
  const { open, onOpenChange } = useDialog();
  if (!open) return null;

  return createPortal(
    <>
      <DialogOverlay onMouseDown={() => onOpenChange?.(false)} />
      <div
        data-slot='dialog-content'
        role='dialog'
        aria-modal='true'
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2',
          'rounded-lg border border-slate-200 bg-white p-6 shadow-xl outline-none sm:max-w-lg',
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

function DialogHeader({ className = '', ...props }) {
  return (
    <div
      data-slot='dialog-header'
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({ className = '', ...props }) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn('mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function DialogTitle({ className = '', ...props }) {
  return (
    <div
      data-slot='dialog-title'
      className={cn('text-lg leading-none font-semibold text-slate-900', className)}
      {...props}
    />
  );
}

function DialogDescription({ className = '', ...props }) {
  return (
    <div
      data-slot='dialog-description'
      className={cn('text-sm text-slate-500', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
