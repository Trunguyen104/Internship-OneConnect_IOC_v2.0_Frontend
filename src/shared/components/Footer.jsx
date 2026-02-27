'use client';

export default function Footer({
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  const pages = getVisiblePages(page, totalPages);

  return (
    <div className='flex items-center justify-between text-sm text-slate-600'>
      <span>
        Total records: <b className='text-slate-800'>{total}</b>
      </span>

      <div className='flex items-center gap-3'>
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className='w-9 h-9 rounded-full border text-slate-400 disabled:opacity-40'
        >
          ‹
        </button>

        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showDots = prev && p - prev > 1;

          return (
            <span key={p} className='flex items-center gap-2'>
              {showDots && <span className='px-1 text-slate-400'>…</span>}

              <button
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 rounded-full
          ${page === p ? 'bg-red-500 text-white' : 'border text-slate-600 hover:bg-slate-100'}`}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className='w-9 h-9 rounded-full border text-slate-400 disabled:opacity-40'
        >
          ›
        </button>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className='ml-4 border rounded-full px-3 py-1'
        >
          <option value={10}>10/page</option>
          <option value={20}>20/page</option>
          <option value={50}>50/page</option>
        </select>
      </div>
    </div>
  );
}

function getVisiblePages(page, totalPages) {
  const pages = new Set();

  pages.add(1);
  pages.add(totalPages);

  for (let i = page - 2; i <= page + 2; i++) {
    if (i > 1 && i < totalPages) pages.add(i);
  }

  return Array.from(pages).sort((a, b) => a - b);
}
