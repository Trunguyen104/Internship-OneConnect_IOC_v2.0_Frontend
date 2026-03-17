'use client';

import React, { memo } from 'react';
import { Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

const STATUS_MAP = {
  0: { label: 'Upcoming', color: 'blue' },
  1: { label: 'Active', color: 'green' },
  2: { label: 'Ended', color: 'orange' },
  3: { label: 'Closed', color: 'red' },
};

const RecentTerms = memo(function RecentTerms({ data, loading }) {
  const columns = [
    {
      title: 'TERM NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className='font-extrabold text-slate-800'>{text}</span>,
    },
    {
      title: 'DURATION',
      key: 'duration',
      render: (_, record) => (
        <Text className='text-xs font-semibold text-slate-500'>
          {dayjs(record.startDate).format('DD MMM')} -{' '}
          {dayjs(record.endDate).format('DD MMM, YYYY')}
        </Text>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        const config = STATUS_MAP[status] || { label: status || 'Unknown', color: 'default' };
        return (
          <Tag
            bordered={false}
            color={config.color}
            className='min-w-[80px] rounded-lg py-1 text-center text-[10px] font-bold tracking-wider uppercase'
          >
            {config.label}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold text-slate-800'>Recent Internship Terms</h3>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        rowKey='termId'
        className='premium-table'
        rowClassName='hover:bg-slate-50 transition-colors cursor-default'
      />
    </div>
  );
});

export default RecentTerms;
