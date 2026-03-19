'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

const SelectCtx = createContext(null);

function Select({ value, defaultValue, onValueChange, name, required, children }) {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? '');
  const [labels, setLabels] = useState({});
  const currentValue = value !== undefined ? value : inner;

  const setValue = (v) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };

  const registerLabel = (v, label) => {
    if (!v || !label) return;
    setLabels((prev) => (prev[v] ? prev : { ...prev, [v]: label }));
  };

  const ctx = {
    open,
    setOpen,
    value: currentValue,
    setValue,
    labels,
    registerLabel,
    name,
    required,
  };

  return (
    <SelectCtx.Provider value={ctx}>
      {name ? (
        <input type='hidden' name={name} value={currentValue} required={required} readOnly />
      ) : null}
      {children}
    </SelectCtx.Provider>
  );
}

function useSelect() {
  const ctx = useContext(SelectCtx);
  if (!ctx) throw new Error('Select components must be used within <Select>');
  return ctx;
}

function SelectTrigger({ className = '', children, ...props }) {
  const { open, setOpen } = useSelect();
  return (
    <button
      type='button'
      data-slot='select-trigger'
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-11 w-full items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 text-sm font-medium text-slate-600',
        'hover:bg-white focus:ring-2 focus:ring-[var(--primary-600)]/20 focus:outline-none',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className='h-4 w-4 text-slate-400' />
    </button>
  );
}

function SelectValue({ placeholder }) {
  const { value, labels } = useSelect();
  if (!value) return <span className='text-slate-400'>{placeholder}</span>;
  return <span>{labels[String(value)] ?? String(value)}</span>;
}

function SelectContent({ className = '', children, position }) {
  const { open, setOpen } = useSelect();
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div ref={rootRef} data-slot='select-content' className={cn('relative')}>
      <div
        className={cn(
          'absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-xl',
          position === 'popper' ? '' : '',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function SelectItem({ value, className = '', children, ...props }) {
  const { setOpen, setValue, value: currentValue, registerLabel } = useSelect();
  const v = String(value);
  const label = typeof children === 'string' ? children : '';

  useEffect(() => {
    registerLabel?.(v, label);
  }, [label, registerLabel, v]);

  const selected = String(currentValue) === v;

  return (
    <button
      type='button'
      data-slot='select-item'
      onClick={() => {
        setValue(v);
        setOpen(false);
      }}
      className={cn(
        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700',
        'hover:bg-slate-50',
        selected ? 'bg-slate-50 font-semibold' : '',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {selected ? <Check className='size-4 text-slate-600' /> : null}
    </button>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
