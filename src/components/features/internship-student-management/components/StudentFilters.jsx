'use client';

import { FilterOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import React from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { cn } from '@/lib/cn';

export const StudentFilters = ({
  groupFilter,
  setGroupFilter,
  mentorFilter,
  setMentorFilter,
  resetFilters,
}) => {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const hasActiveFilters = groupFilter !== 'ALL' || mentorFilter !== 'ALL';

  return (
    <div className="flex items-center gap-2">
      <Select
        allowClear
        placeholder={INTERNSHIP_LIST.FILTERS.GROUP_FILTER}
        value={groupFilter === 'ALL' ? undefined : groupFilter}
        onChange={setGroupFilter}
        className="h-9 min-w-[140px]"
        options={INTERNSHIP_LIST.FILTERS.GROUP_OPTIONS}
        suffixIcon={<FilterOutlined className="text-slate-400" />}
      />

      <Select
        allowClear
        placeholder={INTERNSHIP_LIST.FILTERS.ASSIGNMENT_FILTER}
        value={mentorFilter === 'ALL' ? undefined : mentorFilter}
        onChange={setMentorFilter}
        className="h-9 min-w-[170px]"
        options={INTERNSHIP_LIST.FILTERS.ASSIGNMENT_OPTIONS}
        suffixIcon={<FilterOutlined className="text-slate-400" />}
      />

      <div
        className={cn(
          'transition-all duration-300',
          hasActiveFilters ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <Tooltip title={INTERNSHIP_LIST.FILTERS.CLEAR_ALL}>
          <Button
            type="text"
            icon={<UndoOutlined />}
            onClick={resetFilters}
            className="text-slate-400 hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg transition-all"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default StudentFilters;
