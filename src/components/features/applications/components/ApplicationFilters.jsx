'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import React from 'react';

import DatePicker from '@/components/ui/datepicker';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import { useApplicationFiltersOptions } from '../hooks/useApplicationFiltersOptions';

/**
 * Filter bar for Applications.
 * Supports Search, Phase filter, Status filter, Job filter, School filter, and Toggle for Terminal statuses.
 */
export const ApplicationFilters = ({
  filters,
  onFilterChange,
  schools = [],
  phases = [],
  isLoadingOptions = false,
  isPhaseLocked = false,
  showAudience = true,
}) => {
  const { statusOptions, schoolOptions, phaseOptions, audienceOptions } =
    useApplicationFiltersOptions({ filters, schools, phases });

  const gridColsClass = showAudience ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Search Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[300px] flex-1 items-center gap-3">
          <Input
            placeholder={APPLICATIONS_UI.SEARCH_PLACEHOLDER}
            prefix={<SearchOutlined className="text-slate-400" />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-slate-500">
            {APPLICATIONS_UI.INCLUDE_TERMINAL}
          </span>
          <Switch
            checked={filters.includeTerminal}
            onChange={(checked) => onFilterChange({ includeTerminal: checked })}
            className={filters.includeTerminal ? 'bg-primary!' : 'bg-slate-300!'}
          />
        </div>
      </div>

      {/* Select Filters Row */}
      <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${gridColsClass}`}>
        <Select
          placeholder={APPLICATIONS_UI.ALL_STATUSES}
          className="rounded-2xl!"
          allowClear
          value={filters.status}
          options={statusOptions}
          onChange={(val) => onFilterChange({ status: val })}
        />

        <Select
          placeholder={APPLICATIONS_UI.ALL_SCHOOLS}
          className="rounded-2xl!"
          allowClear
          loading={isLoadingOptions}
          value={filters.schoolId}
          options={schoolOptions}
          onChange={(val) => onFilterChange({ schoolId: val })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />

        <Select
          placeholder={APPLICATIONS_UI.ALL_PHASES}
          className="rounded-2xl!"
          disabled={isPhaseLocked}
          allowClear={!isPhaseLocked}
          loading={isLoadingOptions}
          value={filters.internshipPhaseId}
          options={phaseOptions}
          onChange={(val) => onFilterChange({ internshipPhaseId: val })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />

        {showAudience ? (
          <Select
            placeholder={APPLICATIONS_UI.ALL_AUDIENCES}
            className="rounded-2xl!"
            allowClear
            value={filters.audience}
            options={audienceOptions}
            onChange={(val) => onFilterChange({ audience: val })}
          />
        ) : null}

        <DatePicker
          picker="month"
          placeholder={APPLICATIONS_UI.PERIOD_PLACEHOLDER}
          className="rounded-2xl border-slate-200"
          onChange={(date, dateString) => onFilterChange({ period: dateString || undefined })}
        />
      </div>
    </div>
  );
};

export default ApplicationFilters;
