'use client';

import { Fragment } from 'react';

export default function Pagination({
  total = 0,
  page = 1,
  pageSize = 10,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  const calculatedTotalPages =
    totalPages !== undefined ? totalPages : Math.max(0, Math.ceil(total / pageSize));
  const pages = getVisiblePages(page, calculatedTotalPages);

  return (
    <div className='flex items-center justify-between text-sm text-slate-600'>
      {/* LEFT */}
      <span>
        Total records: <b className='text-slate-800'>{total}</b>
      </span>

      {/* RIGHT */}
      <div className='flex items-center gap-2'>
        {/* PREV */}
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className='h-9 w-9 rounded-full border text-slate-500 hover:bg-slate-100 disabled:opacity-40'
        >
          ‹
        </button>

        {/* PAGE LIST */}
        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showDots = prev && p - prev > 1;

          return (
            <Fragment key={`${p}-${index}`}>
              {showDots && <span className='px-1 text-slate-400'>…</span>}

              <button
                onClick={() => onPageChange(p)}
                className={`h-9 w-9 rounded-full text-sm ${
                  page === p ? 'bg-red-500 text-white' : 'border text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            </Fragment>
          );
        })}

        {/* NEXT */}
        <button
          disabled={page >= calculatedTotalPages}
          onClick={() => onPageChange(page + 1)}
          className='h-9 w-9 rounded-full border text-slate-500 hover:bg-slate-100 disabled:opacity-40'
        >
          ›
        </button>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className='ml-3 rounded-full border px-3 py-1 text-sm'
        >
          <option value={5}>5/page</option>
          <option value={10}>10/page</option>
          <option value={20}>20/page</option>
          <option value={50}>50/page</option>
        </select>
      </div>
    </div>
  );
}

function getVisiblePages(page, totalPages) {
  if (totalPages <= 0) return [];

  const pages = new Set();

  pages.add(1);
  if (totalPages > 1) {
    pages.add(totalPages);
  }

  for (let i = page - 2; i <= page + 2; i++) {
    if (i > 1 && i < totalPages) {
      pages.add(i);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
