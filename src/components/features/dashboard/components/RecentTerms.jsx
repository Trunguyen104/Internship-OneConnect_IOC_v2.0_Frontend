'use client';

import React, { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import DataTable from '@/components/ui/DataTable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { DASHBOARD, TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

const STATUS_CONFIG = {
  1: { bgClass: 'bg-info-surface', textClass: 'text-info' },
  2: { bgClass: 'bg-success-surface', textClass: 'text-success' },
  3: { bgClass: 'bg-warning-surface', textClass: 'text-warning' },
  4: { bgClass: 'bg-danger-surface', textClass: 'text-danger' },
  Upcoming: { bgClass: 'bg-info-surface', textClass: 'text-info' },
  Active: { bgClass: 'bg-success-surface', textClass: 'text-success' },
  Ended: { bgClass: 'bg-warning-surface', textClass: 'text-warning' },
  Closed: { bgClass: 'bg-danger-surface', textClass: 'text-danger' },
};

const RecentTerms = memo(function RecentTerms({ data, loading }) {
  const { RECENT_TERMS } = DASHBOARD;

  const columns = useMemo(
    () => [
      {
        title: RECENT_TERMS.TABLE.COLUMNS.NAME,
        key: 'name',
        render: (text) => (
          <div className='flex min-w-0 flex-col py-1'>
            <span className='text-text mb-0.5 line-clamp-1 text-sm font-bold tracking-tight'>
              {text}
            </span>
            <span className='text-muted text-[10px] font-semibold tracking-widest uppercase opacity-70'>
              {RECENT_TERMS.SUBTITLE}
            </span>
          </div>
        ),
      },
      {
        title: RECENT_TERMS.TABLE.COLUMNS.DURATION,
        key: 'duration',
        width: '240px',
        render: (_, record) => (
          <div className='text-muted/90 flex items-center gap-2'>
            <span className='text-xs font-bold tracking-wide whitespace-nowrap'>
              {dayjs(record.startDate).format('MMM DD')} —{' '}
              {dayjs(record.endDate).format('MMM DD, YYYY')}
            </span>
          </div>
        ),
      },
      {
        title: RECENT_TERMS.TABLE.COLUMNS.STATUS,
        key: 'status',
        width: '140px',
        align: 'center',
        render: (status) => {
          const config = STATUS_CONFIG[status] || {
            bgClass: 'bg-gray-100',
            textClass: 'text-gray-500',
          };
          const label = TERM_MANAGEMENT.STATUS_LABELS[status] || status;

          // Modern dot indicator style
          const dotColor = config.textClass.replace('text-', 'bg-');

          return (
            <div
              className={`${config.bgClass} inline-flex items-center gap-2 rounded-full px-3.5 py-1 transition-all duration-300 hover:brightness-95`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse shadow-[0_0_6px_rgba(0,0,0,0.1)]`}
              />
              <span
                className={`${config.textClass} text-[11px] font-black tracking-wider uppercase`}
              >
                {label}
              </span>
            </div>
          );
        },
      },
    ],
    [RECENT_TERMS],
  );

  return (
    <div className='flex min-h-[400px] flex-1 flex-col space-y-6 overflow-hidden'>
      <div className='flex flex-shrink-0 items-center justify-between px-2'>
        <div className='flex flex-col'>
          <h3 className='text-text text-xl font-black tracking-tighter'>{RECENT_TERMS.TITLE}</h3>
          <div className='bg-primary/20 mt-1 h-1 w-8 rounded-full' />
        </div>
        <button className='text-primary border-primary/20 hover:bg-primary hover:shadow-primary/20 rounded-full border px-5 py-2 text-xs font-black shadow-sm transition-all duration-300 hover:text-white active:scale-95'>
          {RECENT_TERMS.VIEW_ALL_BTN}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey='termId'
        minWidth='0'
        className='!mt-2 flex-1'
      />
    </div>
  );
});

export default RecentTerms;
