'use client';

import React, { memo, useCallback } from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';

const FiltersAndSearch = memo(function FiltersAndSearch({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  majorFilter,
  onMajorFilterChange,
  statusOptions = [
    { label: 'Đang thực tập', value: 'INTERNSHIP' },
    { label: 'Hoàn thành', value: 'COMPLETED' },
    { label: 'Đã rút lui', value: 'WITHDRAWN' },
  ],
  majorOptions = [
    { label: 'Kỹ thuật phần mềm', value: 'Software Engineering' },
    { label: 'An toàn thông tin', value: 'Information Security' },
    { label: 'Thiết kế đồ họa', value: 'Graphic Design' },
  ],
}) {
  const { STUDENT_ENROLLMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

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
    <div className='bg-surface border-border mb-6 flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-sm'>
      <div className='min-w-[300px] flex-1'>
        <Input
          prefix={<SearchOutlined className='text-muted mr-2 ml-1 text-lg' />}
          placeholder={STUDENT_ENROLLMENT.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          className='bg-muted/5 border-border hover:border-primary focus:border-primary h-11 rounded-xl transition-all'
        />
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <Select
          allowClear
          placeholder={STUDENT_ENROLLMENT.STATUS_FILTER}
          value={statusFilter || undefined}
          onChange={handleStatusChange}
          className='h-11 min-w-[200px]'
          options={statusOptions}
          suffixIcon={<FilterOutlined className='text-muted' />}
        />

        <Select
          allowClear
          placeholder={STUDENT_ENROLLMENT.MAJOR_FILTER}
          value={majorFilter || undefined}
          onChange={handleMajorChange}
          className='h-11 min-w-[220px]'
          options={majorOptions}
          suffixIcon={<FilterOutlined className='text-muted' />}
        />
      </div>
    </div>
  );
});

export default FiltersAndSearch;
