'use client';

import { useEffect, useRef, useState } from 'react';

export default function MoreMenuButton({
  items = [{ label: 'Delete', value: 'delete', tone: 'danger' }],
  onSelect,
  align = 'right',
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function handleSelect(item) {
    setOpen(false);
    onSelect?.(item);
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      {/* Icon-only button (default) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'group',
          'h-8 w-8 rounded-full',
          'inline-flex items-center justify-center',

          // default (idle)
          'text-[var(--color-muted)]',

          // hover / active
          'hover:text-[var(--primary-600)]',
          'hover:bg-[var(--primary-50)]',
          open ? 'bg-[var(--primary-50)] text-[var(--primary-600)]' : '',

          // focus
          'focus:outline-none',
        ].join(' ')}
        title="More"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-xl leading-none">⋮</span>
      </button>

      {/* Popover */}
      {open ? (
        <div
          role="menu"
          className={[
            'absolute top-10 z-50 min-w-[120px]',
            align === 'left' ? 'left-0' : 'right-0',
            'rounded-2xl border border-[var(--color-border)]',
            'bg-[var(--color-surface)] shadow-xl',
            'p-1',
          ].join(' ')}
        >
          {items.map((it) => (
            <button
              key={it.value}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(it)}
              className={[
                'flex w-full items-center gap-3',
                'rounded-xl px-3 py-2',
                'text-sm font-semibold',
                'hover:bg-[var(--primary-50)]',
                it.tone === 'danger' ? 'text-[var(--primary-600)]' : 'text-[var(--color-text)]',
              ].join(' ')}
            >
              <TrashIcon />
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3h6m-8 4h10m-9 0 1 14h6l1-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
