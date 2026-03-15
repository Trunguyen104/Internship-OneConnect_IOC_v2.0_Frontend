'use client';

import React, { memo } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';

const TermFilterBar = memo(function TermFilterBar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  const { TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  return (
    <div className='bg-surface border-border mb-6 flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-sm'>
      <div className='min-w-[320px] flex-1'>
        <Input
          prefix={<SearchOutlined className='text-muted mr-2 ml-1 text-lg' />}
          placeholder={TERM_MANAGEMENT.SEARCH_PLACEHOLDER}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className='bg-muted/5 border-border hover:border-primary focus:border-primary h-11 rounded-xl transition-all'
        />
      </div>

      <div className='flex items-center gap-3'>
        <Select
          allowClear
          placeholder={TERM_MANAGEMENT.STATUS_FILTER}
          value={statusFilter ?? undefined}
          onChange={onStatusChange}
          className='h-11 min-w-[200px]'
          options={[
            { value: 1, label: 'Đang hoạt động' },
            { value: 0, label: 'Bản nháp' },
            { value: 2, label: 'Đã hoàn thành' },
          ]}
          suffixIcon={<FilterOutlined className='text-muted' />}
        />
      </div>
    </div>
  );
});

export default TermFilterBar;
