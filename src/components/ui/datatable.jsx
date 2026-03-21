'use client';

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import React from 'react';

import SkeletonTable from './SkeletonTable';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyText = 'No data found',
  minWidth = '1000px',
  rowKey = 'id',
  onRowClick,
  className = '',
  sortBy,
  sortOrder,
  onSort,
}) {
  const handleSort = (columnKey) => {
    if (!onSort || !columnKey) return;

    if (sortBy === columnKey) {
      onSort(columnKey, sortOrder === 'Asc' ? 'Desc' : 'Asc');
    } else {
      onSort(columnKey, 'Asc');
    }
  };

  if (loading && (!Array.isArray(data) || data.length === 0)) {
    return (
      <div className="flex flex-1 flex-col py-6">
        <SkeletonTable rows={10} columns={columns.length || 4} />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <Empty description={<span className="text-muted font-medium">{emptyText}</span>} />
      </div>
    );
  }

  return (
    <div className={`mt-5 flex min-h-0 flex-1 flex-col ${className}`}>
      <div className="flex-1 overflow-auto">
        <table className="w-full table-fixed border-collapse text-left" style={{ minWidth }}>
          <thead className="border-border bg-bg sticky top-0 z-10 border-b">
            <tr>
              {columns.map((col, index) => {
                const isSorted = sortBy === col.sortKey;
                const canSort = !!onSort && !!col.sortKey && col.sorter !== false;

                return (
                  <th
                    key={col.key || col.title || index}
                    style={{ width: col.width }}
                    onClick={() => canSort && handleSort(col.sortKey)}
                    className={`text-muted px-6 py-5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''} ${canSort ? 'cursor-pointer hover:text-primary transition-colors' : ''} `}
                  >
                    <div
                      className={`flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}
                    >
                      {col.title}
                      {canSort && (
                        <div className="flex flex-col text-[8px] leading-[4px]">
                          <ArrowUpOutlined
                            className={`${isSorted && sortOrder === 'Asc' ? 'text-primary' : 'text-muted/30'}`}
                          />
                          <ArrowDownOutlined
                            className={`${isSorted && sortOrder === 'Desc' ? 'text-primary' : 'text-muted/30'}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-border/50 divide-y">
            {data.filter(Boolean).map((record, index) => (
              <tr
                key={record?.[rowKey] || record?.id || record?.key || index}
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
