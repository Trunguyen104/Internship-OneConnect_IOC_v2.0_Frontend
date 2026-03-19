'use client';

import React, { memo, useMemo } from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import DataTable from '@/components/ui/datatable';

const STATUS_MAP = {
  0: { label: 'Upcoming', color: 'processing' },
  1: { label: 'Active', color: 'success' },
  2: { label: 'Ended', color: 'warning' },
  3: { label: 'Closed', color: 'error' },
};

const RecentTerms = memo(function RecentTerms({ data, loading }) {
  const columns = useMemo(
    () => [
      {
        title: 'TERM NAME',
        key: 'name',
        width: '250px',
        render: (text) => (
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-slate-800'>{text}</span>
            <span className='text-[10px] font-medium tracking-tight text-slate-400 uppercase'>
              Internship Phase
            </span>
          </div>
        ),
      },
      {
        title: 'DURATION',
        key: 'duration',
        width: '200px',
        render: (_, record) => (
          <div className='flex items-center gap-2 text-slate-500'>
            <span className='text-xs font-semibold'>
              {dayjs(record.startDate).format('DD MMM')} -{' '}
              {dayjs(record.endDate).format('DD MMM, YYYY')}
            </span>
          </div>
        ),
      },
      {
        title: 'STATUS',
        key: 'status',
        width: '120px',
        align: 'center',
        render: (status) => {
          const config = STATUS_MAP[status] || { label: status || 'Unknown', color: 'default' };
          return (
            <Tag
              bordered={false}
              color={config.color}
              className='bg-opacity-10 min-w-[85px] rounded-full py-0.5 text-center text-[10px] font-bold tracking-wider uppercase'
            >
              {config.label}
            </Tag>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className='flex min-h-[400px] flex-1 flex-col space-y-6'>
      <div className='flex flex-shrink-0 items-center justify-between px-2'>
        <div className='space-y-1'>
          <h3 className='text-lg font-black tracking-tight text-slate-800'>
            Recent Internship Terms
          </h3>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey='termId'
        minWidth='100%'
        className='no-scrollbar !mt-0 flex-1 overflow-auto'
      />
    </div>
  );
});

export default RecentTerms;
