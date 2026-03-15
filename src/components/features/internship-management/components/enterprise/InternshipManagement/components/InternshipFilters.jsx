'use client';

import React from 'react';
import { Row, Col, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { STATUS_CONFIG, MOCK_MENTORS } from '../constants/internshipData';

const InternshipFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  mentorFilter,
  onMentorChange,
  onQuickStatusChange,
}) => {
  const { FILTERS } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  return (
    <div className='mb-6 flex w-full flex-col gap-6 p-6 pb-0'>
      {/* Search + Filters row */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='max-w-xl flex-1'>
          <Input
            placeholder={FILTERS.SEARCH_PLACEHOLDER}
            prefix={<SearchOutlined className='text-muted ml-1' />}
            allowClear
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className='bg-surface border-border hover:border-primary focus:border-primary h-11 rounded-xl transition-all'
          />
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <Select
            className='h-11 min-w-[160px]'
            value={statusFilter}
            onChange={onStatusChange}
            options={[
              { label: FILTERS.ALL_STATUSES, value: 'ALL' },
              { label: 'Đang chờ duyệt', value: 'PENDING' },
              { label: 'Đã chấp nhận', value: 'ACCEPTED' },
              { label: 'Đã từ chối', value: 'REJECTED' },
              { label: 'Bị thu hồi', value: 'REVOKED' },
            ]}
          />

          <Select
            className='h-11 min-w-[170px]'
            placeholder={FILTERS.MENTOR_PLACEHOLDER}
            value={mentorFilter}
            allowClear
            onChange={onMentorChange}
            options={MOCK_MENTORS.map((m) => ({
              label: m.name,
              value: m.id,
            }))}
          />

          <Button
            icon={<FilterOutlined className='text-primary' />}
            className='border-border h-11 rounded-xl font-semibold transition-all hover:bg-slate-50'
          >
            {FILTERS.FILTER_BTN}
          </Button>
        </div>
      </div>

      {/* Quick Status Tags */}
      <div className='flex flex-wrap items-center gap-2'>
        <Tag
          className={`cursor-pointer rounded-full border-none px-6 py-1.5 text-xs font-black tracking-widest uppercase transition-all ${
            statusFilter === 'ALL'
              ? 'bg-primary shadow-primary/20 text-white shadow-md'
              : 'bg-muted/10 text-muted hover:bg-muted/20'
          }`}
          onClick={() => onQuickStatusChange('ALL')}
        >
          {FILTERS.ALL_STUDENTS}
        </Tag>

        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <Tag
            key={key}
            className={`cursor-pointer rounded-full border-none px-6 py-1.5 text-xs font-black tracking-widest uppercase transition-all ${
              statusFilter === key
                ? `bg-${config.color} text-white shadow-md`
                : 'bg-muted/10 text-muted hover:bg-muted/20'
            }`}
            style={statusFilter === key ? { backgroundColor: `var(--color-${config.color})` } : {}}
            onClick={() => onQuickStatusChange(key)}
          >
            {config.label}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default InternshipFilters;
