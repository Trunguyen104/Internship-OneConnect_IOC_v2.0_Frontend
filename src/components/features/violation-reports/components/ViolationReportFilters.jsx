'use client';

import { CalendarOutlined, FilterOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, DatePicker, Select } from 'antd';
import React from 'react';

import { VIOLATION_REPORT_UI } from '../constants/violationReportUI';

const { RangePicker } = DatePicker;

export default function ViolationReportFilters({
  params,
  groups,
  onFilterChange,
  dateRange,
  onDateRangeChange,
  onReset,
}) {
  const { FILTERS } = VIOLATION_REPORT_UI;

  return (
    <>
      <RangePicker
        value={dateRange}
        onChange={onDateRangeChange}
        className="h-9 rounded-lg"
        placeholder={[FILTERS.START_DATE, FILTERS.END_DATE]}
        suffixIcon={<CalendarOutlined className="text-muted" />}
      />

      <Select
        allowClear
        placeholder={FILTERS.GROUP}
        value={params.groupId}
        onChange={(val) => onFilterChange({ groupId: val })}
        className="h-9 min-w-[150px]"
        options={groups.map((g) => ({ label: g.name, value: g.id }))}
        suffixIcon={<FilterOutlined className="text-muted" />}
      />

      <Button
        type="text"
        icon={<UndoOutlined />}
        onClick={onReset}
        className="text-muted hover:text-primary flex items-center gap-1 text-sm transition-colors"
      >
        {FILTERS.RESET}
      </Button>
    </>
  );
}
