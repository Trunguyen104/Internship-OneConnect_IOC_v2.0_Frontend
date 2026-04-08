'use client';

import { Switch } from 'antd';
import React from 'react';

import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Select from '@/components/ui/select';

import { JOB_POSTING_UI } from '../constants/job-postings.constant';

export const JobPostingsFilters = ({ filters, onFilterChange, onCreate }) => {
  return (
    <DataTableToolbar className="mb-6">
      <DataTableToolbar.Search
        placeholder={JOB_POSTING_UI.SEARCH_PLACEHOLDER}
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="rounded-full"
      />

      <DataTableToolbar.Filters>
        <Select
          value={filters.status}
          onChange={(val) => onFilterChange({ status: val })}
          placeholder={JOB_POSTING_UI.TABLE.COLUMNS.STATUS}
          className="!h-9 min-w-[160px] custom-select-toolbar"
          allowClear
          options={[
            { label: JOB_POSTING_UI.FILTERS.ALL, value: 'ALL' },
            { label: JOB_POSTING_UI.FILTERS.DRAFT, value: 1 },
            { label: JOB_POSTING_UI.FILTERS.PUBLISHED, value: 2 },
            { label: JOB_POSTING_UI.FILTERS.CLOSED, value: 3 },
          ]}
        />

        <div className="flex items-center gap-2 px-2 py-1 bg-bg border border-border rounded-lg hover:border-border/80 transition-all cursor-default select-none shrink-0 border-dashed">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            {JOB_POSTING_UI.FILTERS.INCLUDE_DELETED}
          </span>
          <Switch
            size="small"
            checked={filters.includeDeleted}
            onChange={(val) => onFilterChange({ includeDeleted: val })}
            className="hover:shadow-sm transition-shadow"
          />
        </div>
      </DataTableToolbar.Filters>

      {onCreate && (
        <DataTableToolbar.Actions
          label={JOB_POSTING_UI.CREATE_BUTTON}
          onClick={onCreate}
          className="ml-auto"
        />
      )}
    </DataTableToolbar>
  );
};

export default JobPostingsFilters;
