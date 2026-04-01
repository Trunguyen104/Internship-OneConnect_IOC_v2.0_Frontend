'use client';

import { SearchOutlined } from '@ant-design/icons';
import React from 'react';

import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import { JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';

export const JobPostingsFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { label: JOB_POSTING_UI.FILTERS.ALL, value: undefined },
    { label: JOB_POSTING_UI.FILTERS.DRAFT, value: JOB_STATUS.DRAFT },
    { label: JOB_POSTING_UI.FILTERS.PUBLISHED, value: JOB_STATUS.PUBLISHED },
    { label: JOB_POSTING_UI.FILTERS.CLOSED, value: JOB_STATUS.CLOSED },
  ];

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[300px] flex-1 items-center gap-3">
          <Input
            placeholder={JOB_POSTING_UI.SEARCH_PLACEHOLDER}
            prefix={<SearchOutlined className="text-slate-400" />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:shadow-sm h-10"
          />
        </div>

        <div className="w-[200px]">
          <Select
            placeholder="Select Status"
            className="rounded-2xl! h-10"
            allowClear
            value={filters.status}
            options={statusOptions}
            onChange={(val) => onFilterChange({ status: val })}
          />
        </div>
      </div>
    </div>
  );
};

export default JobPostingsFilters;
