'use client';

import { Drawer as AntdDrawer } from 'antd';
import React, { createContext, useContext, useMemo } from 'react';

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

  const { width, size, ...restProps } = props;

  return (
    <AntdDrawer
      open={open}
      onClose={() => onOpenChange?.(false)}
      placement={side}
      closable={showCloseButton}
      destroyOnHidden
      size={size || 'default'}
      className={cn('premium-drawer', className)}
      styles={{
        wrapper: { width: width || 520 },
        body: { padding: 0 },
      }}
      {...restProps}
    >
      <div className="flex h-full flex-col">{children}</div>
    </AntdDrawer>
  );
}

function SheetHeader({ className = '', ...props }) {
  return <div data-slot="sheet-header" className={cn('px-6 pt-6 pb-2', className)} {...props} />;
}

function SheetTitle({ className = '', ...props }) {
  return (
    <div
      data-slot="sheet-title"
      className={cn('text-2xl font-bold tracking-tight text-slate-900', className)}
      {...props}
    />
  );
}

function SheetDescription({ className = '', ...props }) {
  return (
    <div
      data-slot="sheet-description"
      className={cn('mt-1 text-sm text-slate-500', className)}
      {...props}
    />
  );
}

export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle };
