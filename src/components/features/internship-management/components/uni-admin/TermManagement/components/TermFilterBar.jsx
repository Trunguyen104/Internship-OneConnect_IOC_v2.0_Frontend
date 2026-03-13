'use client';
import React, { memo } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const TermFilterBar = memo(function TermFilterBar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex w-full flex-1 items-center gap-3 sm:w-auto'>
        <Input
          placeholder='Tìm tên kỳ thực tập…'
          prefix={<SearchOutlined className='text-gray-400' />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          size='large'
          allowClear
          autoComplete='off'
          spellCheck={false}
          className='max-w-md rounded-md'
        />

        <Select
          size='large'
          className='min-w-[160px]'
          value={statusFilter ?? undefined}
          onChange={onStatusChange}
          placeholder='Tất cả trạng thái'
          allowClear
          suffixIcon={<FilterOutlined className='text-gray-400' />}
          options={[
            { value: 1, label: 'Đang mở' },
            { value: 0, label: 'Bản nháp' },
            { value: 2, label: 'Đã đóng' },
          ]}
        />
      </div>
    </div>
  );
});

export default TermFilterBar;
