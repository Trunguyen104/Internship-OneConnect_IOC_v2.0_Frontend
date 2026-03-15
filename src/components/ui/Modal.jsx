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
        <div className='border-border/60 bg-surface w-full max-w-[520px] rounded-2xl border shadow-xl'>
          <div className='border-border/60 flex items-center justify-between border-b px-5 py-4'>
            <div className='text-sm font-semibold'>{title}</div>
            <button
              type='button'
              onClick={onClose}
              className='border-border/60 bg-bg text-muted hover:bg-surface h-9 w-9 rounded-full border'
              title='Đóng'
            >
              ✕
            </button>
          </div>

          <div className='px-5 py-4'>{children}</div>

          {footer ? (
            <div className='border-border/60 flex items-center justify-end gap-2 border-t px-5 py-4'>
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
