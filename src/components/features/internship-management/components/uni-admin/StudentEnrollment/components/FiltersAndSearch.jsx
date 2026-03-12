'use client';
import React, { memo, useCallback } from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const FiltersAndSearch = memo(function FiltersAndSearch({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  majorFilter,
  onMajorFilterChange,
  statusOptions = [],
  majorOptions = [],
}) {
  const handleSearchChange = useCallback(
    (e) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange],
  );

  const handleStatusChange = useCallback(
    (value) => {
      onStatusFilterChange(value || '');
    },
    [onStatusFilterChange],
  );

  const handleMajorChange = useCallback(
    (value) => {
      onMajorFilterChange(value || '');
    },
    [onMajorFilterChange],
  );

  return (
    <div className='mb-6 flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white p-2 pr-3 pl-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'>
      <div className='w-full flex-1'>
        <Input
          prefix={<SearchOutlined className='mr-2 text-lg text-slate-400' />}
          placeholder='Tìm kiếm theo tên hoặc MSSV...'
          value={searchTerm}
          onChange={handleSearchChange}
          size='middle'
          className='w-full rounded-full border-none bg-transparent shadow-none focus-within:bg-slate-50 hover:bg-slate-50'
          style={{ padding: '8px 16px' }}
        />
      </div>

      <div className='hidden h-8 w-[1px] bg-slate-200 md:block' />

      <Space size='middle' className='w-full flex-wrap md:w-auto md:flex-nowrap'>
        <Select
          allowClear
          placeholder='Trạng thái: Tất cả'
          size='middle'
          value={statusFilter || undefined}
          onChange={handleStatusChange}
          className='min-w-[160px]'
          variant='borderless'
          options={statusOptions}
        />

        <div className='hidden h-6 w-[1px] bg-slate-200 md:block' />

        <Select
          allowClear
          placeholder='Ngành học: Tất cả'
          size='middle'
          value={majorFilter || undefined}
          onChange={handleMajorChange}
          className='min-w-[180px]'
          variant='borderless'
          options={majorOptions}
        />
      </Space>
    </div>
  );
});

export default FiltersAndSearch;
