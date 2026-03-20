'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Shared UI Components for Task/Backlog Modals
 */

export function FieldLabel({ required, children }) {
  return (
    <div className="text-text mb-[6px] text-sm font-semibold">
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </div>
  );
}

export function Select({ value, onChange, options = [], placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedOption = options.find((op) => op.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border-border/70 hover:border-border focus:border-primary focus:ring-primary flex h-10 w-full items-center justify-between rounded-2xl border bg-white px-4 text-sm transition-colors outline-none focus:ring-1"
      >
        <span className={value ? 'text-text font-medium' : 'text-muted font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`text-muted h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-border/50 absolute left-0 z-50 mt-2 w-full origin-top overflow-hidden rounded-2xl border bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          {options.map((op) => {
            const isSelected = value === op.value;
            return (
              <button
                key={op.value}
                type="button"
                onClick={() => {
                  onChange?.(op.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-[14px] transition-colors ${
                  isSelected
                    ? 'bg-primary-50 text-primary font-bold'
                    : 'text-text font-medium hover:bg-gray-50'
                }`}
              >
                {op.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="border-border/70 text-text focus:border-primary focus:ring-primary placeholder:text-muted h-10 w-full rounded-full border bg-white px-4 text-sm outline-none focus:ring-1"
    />
  );
}
