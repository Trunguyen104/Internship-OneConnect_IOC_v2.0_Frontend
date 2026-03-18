'use client';

import React from 'react';
import { Empty, Skeleton } from 'antd';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyText = 'No data found',
  minWidth = '1000px',
  rowKey = 'id',
  onRowClick,
  className = '',
}) {
  if (loading && (!data || data.length === 0)) {
    return (
      <div className='flex flex-1 items-center justify-center py-20'>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center py-12'>
        <Empty description={<span className='text-muted font-medium'>{emptyText}</span>} />
      </div>
    );
  }

  return (
    <div className={`mt-5 flex min-h-0 flex-1 flex-col ${className}`}>
      <div className='flex-1 overflow-auto'>
        <table className='w-full table-fixed border-collapse text-left' style={{ minWidth }}>
          <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key || col.title || index}
                  style={{ width: col.width }}
                  className={`text-muted px-6 py-5 text-xs font-semibold tracking-wider uppercase ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''} `}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-border/50 divide-y'>
            {data.map((record, index) => (
              <tr
                key={record[rowKey] || index}
                onClick={() => onRowClick?.(record)}
                className={`hover:bg-bg/80 h-[72px] transition-colors ${onRowClick ? 'cursor-pointer' : ''} `}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key || col.title || colIndex}
                    className={`px-6 py-4 align-middle text-sm transition-all ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''} `}
                  >
                    {col.render ? col.render(record[col.key], record, index) : record[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
