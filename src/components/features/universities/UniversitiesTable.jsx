import React, { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { UI_TEXT } from '@/lib/UI_Text';

import UniversitiesAction from './UniversitiesAction';

export default function UniversitiesTable({ universities = [], loading = false }) {
  const columns = useMemo(
    () => [
      {
        title: UI_TEXT.USER_MANAGEMENT.CODE,
        key: 'code',
        width: '140px',
        render: (code) => (
          <span className="text-xs font-black uppercase tracking-widest text-muted/60">
            {code || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.UNIVERSITIES.UNIVERSITY,
        key: 'name',
        render: (name, record) => (
          <div className="flex items-center gap-5">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md group-hover:rotate-3">
              {record.logoUrl ? (
                <img src={record.logoUrl} alt={name} className="h-full w-full object-contain p-2" />
              ) : (
                <span className="text-[13px] font-black tracking-tighter text-primary/40">
                  {name
                    ?.split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <span className="text-[15px] leading-tight font-black tracking-tight text-text transition-colors group-hover:text-primary">
              {name || UI_TEXT.COMMON.MINUS}
            </span>
          </div>
        ),
      },
      {
        title: UI_TEXT.UNIVERSITIES.ADDRESS,
        key: 'address',
        className: 'hidden lg:table-cell',
        render: (address) => (
          <span className="text-text/60 text-[13px] font-bold transition-colors group-hover:text-text line-clamp-1">
            {address || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.COMMON.ACTION,
        key: 'action',
        align: 'right',
        render: (_, record) => (
          <div className="flex justify-end">
            <UniversitiesAction university={record} />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <DataTable
        columns={columns}
        data={universities}
        loading={loading}
        rowKey={(record) => record.universityId}
        emptyText={UI_TEXT.UNIVERSITIES.NOT_FOUND || 'No universities found'}
        minWidth="auto"
        className="premium-table mt-0"
      />
    </div>
  );
}
