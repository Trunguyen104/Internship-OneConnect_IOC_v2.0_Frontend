'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Shared UI Components for Task/Backlog Modals
 */

export function FieldLabel({ required, children }) {
  return (
    <div className='mb-[6px] text-sm font-semibold text-slate-700'>
      {children}
      {required ? <span className='text-red-500'> *</span> : null}
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
    <div className='relative w-full' ref={containerRef}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='h-10 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none flex items-center justify-between hover:border-slate-400 transition-colors focus:border-red-400 focus:ring-1 focus:ring-red-400'
      >
        <span className={value ? 'text-slate-700 font-medium' : 'text-slate-400 font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {open && (
        <div className='absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 overflow-hidden left-0 origin-top'>
          {options.map((op) => {
            const isSelected = value === op.value;
            return (
              <button
                key={op.value}
                type='button'
                onClick={() => {
                  onChange?.(op.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[14px] transition-colors ${isSelected
                    ? 'bg-red-50 text-[#A32A2A] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
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
      className='h-10 w-full rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 placeholder:text-slate-400'
    />
  );
}
