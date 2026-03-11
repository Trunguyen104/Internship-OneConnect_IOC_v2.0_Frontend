'use client';

import { useEffect } from 'react';

export default function Modal({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    // khóa scroll nền
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-[100]'>
      {/* overlay */}
      <button
        type='button'
        aria-label='Close modal'
        onClick={onClose}
        className='absolute inset-0 bg-black/30'
      />

      {/* dialog */}
      <div className='absolute inset-0 flex items-center justify-center p-4'>
        <div className='w-full max-w-[520px] rounded-2xl border border-border/60 bg-surface shadow-xl'>
          <div className='flex items-center justify-between border-b border-border/60 px-5 py-4'>
            <div className='text-sm font-semibold'>{title}</div>
            <button
              type='button'
              onClick={onClose}
              className='h-9 w-9 rounded-full border border-border/60 bg-bg text-muted hover:bg-surface'
              title='Đóng'
            >
              ✕
            </button>
          </div>

          <div className='px-5 py-4'>{children}</div>

          {footer ? (
            <div className='flex items-center justify-end gap-2 border-t border-border/60 px-5 py-4'>
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

