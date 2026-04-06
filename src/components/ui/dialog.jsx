'use client';

import { Modal as AntdModal } from 'antd';
import React, { createContext, useContext, useMemo } from 'react';

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
    <button type="button" {...props}>
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
    <button type="button" {...props}>
      {children}
    </button>
  );
}

function DialogContent({ className = '', children, showCloseButton = true, ...props }) {
  const { open, onOpenChange } = useDialog();

  return (
    <AntdModal
      open={open}
      onCancel={() => onOpenChange?.(false)}
      footer={null}
      destroyOnHidden
      centered
      closable={showCloseButton}
      className={cn('premium-modal', className)}
      {...props}
    >
      <div className="pt-2">{children}</div>
    </AntdModal>
  );
}

function DialogHeader({ className = '', ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('mb-4 flex flex-col gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({ className = '', ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function DialogTitle({ className = '', ...props }) {
  return (
    <div
      data-slot="dialog-title"
      className={cn('text-xl font-bold tracking-tight text-slate-900', className)}
      {...props}
    />
  );
}

function DialogDescription({ className = '', ...props }) {
  return (
    <div
      data-slot="dialog-description"
      className={cn('text-sm text-slate-500', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
