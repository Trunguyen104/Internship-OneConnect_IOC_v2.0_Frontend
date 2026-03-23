'use client';

import {
  CloseOutlined,
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Divider, Popover, Select, Tag, Typography } from 'antd';
import React, { useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

export const StudentFilters = ({
  termId,
  setTermId,
  termOptions,
  fetchingTerms,
  statusFilter,
  setStatusFilter,
  groupFilter,
  setGroupFilter,
  assignmentFilter,
  setAssignmentFilter,
  projectFilter,
  setProjectFilter,
  universityFilter,
  setUniversityFilter,
  majorFilter,
  setMajorFilter,
  dateFilter,
  setDateFilter,
  universityOptions,
  resetFilters,
}) => {
  const [open, setOpen] = useState(false);
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;

  const FILTER_CONFIG = {
    term: {
      label: INTERNSHIP_LIST.FILTERS.TERM_LABEL,
      options: termOptions,
      value: termId,
      onChange: setTermId,
      loading: fetchingTerms,
    },
    status: {
      label: INTERNSHIP_LIST.FILTERS.STATUS_FILTER,
      options: INTERNSHIP_LIST.FILTERS.STATUS_OPTIONS.filter((o) => o.value !== 'ALL'),
      value: statusFilter === 'ALL' ? undefined : statusFilter,
      onChange: setStatusFilter,
    },
    group: {
      label: INTERNSHIP_LIST.FILTERS.GROUP_FILTER,
      options: INTERNSHIP_LIST.FILTERS.GROUP_OPTIONS.filter((o) => o.value !== 'ALL'),
      value: groupFilter === 'ALL' ? undefined : groupFilter,
      onChange: setGroupFilter,
    },
    assignment: {
      label: INTERNSHIP_LIST.FILTERS.ASSIGNMENT_FILTER,
      options: INTERNSHIP_LIST.FILTERS.ASSIGNMENT_OPTIONS.filter((o) => o.value !== 'ALL'),
      value: assignmentFilter === 'ALL' ? undefined : assignmentFilter,
      onChange: setAssignmentFilter,
    },
    project: {
      label: INTERNSHIP_LIST.FILTERS.PROJECT_STATUS,
      options: INTERNSHIP_LIST.FILTERS.PROJECT_OPTIONS,
      value: projectFilter === 'ALL' ? undefined : projectFilter,
      onChange: setProjectFilter,
    },
    university: {
      label: INTERNSHIP_LIST.FILTERS.UNIVERSITY_LABEL,
      options: universityOptions,
      value: universityFilter,
      onChange: setUniversityFilter,
    },
    major: {
      label: INTERNSHIP_LIST.FILTERS.MAJOR_LABEL,
      options: INTERNSHIP_LIST.MODALS.ADD.MAJOR_OPTIONS,
      value: majorFilter,
      onChange: setMajorFilter,
    },
    date: {
      label: INTERNSHIP_LIST.FILTERS.DATE_FILTER_PLACEHOLDER,
      value: dateFilter,
      onChange: setDateFilter,
    },
  };

  // Rows in the builder: each row is { id, type }
  const [rows, setRows] = useState(() => {
    const active = [];
    if (termId) active.push({ id: 'term', type: 'term' });
    if (statusFilter !== 'ALL') active.push({ id: 'status', type: 'status' });
    if (groupFilter !== 'ALL') active.push({ id: 'group', type: 'group' });
    if (assignmentFilter !== 'ALL') active.push({ id: 'assignment', type: 'assignment' });
    if (projectFilter !== 'ALL') active.push({ id: 'project', type: 'project' });
    if (universityFilter) active.push({ id: 'university', type: 'university' });
    if (majorFilter) active.push({ id: 'major', type: 'major' });
    if (dateFilter) active.push({ id: 'date', type: 'date' });

    return active.length > 0 ? active : [{ id: Date.now(), type: null }];
  });

  const addRow = () => {
    setRows([...rows, { id: Date.now(), type: null }]);
  };

  const removeRow = (id, type) => {
    setRows(rows.filter((r) => r.id !== id));
    // Reset value if it was set
    if (type && FILTER_CONFIG[type]) {
      const { onChange } = FILTER_CONFIG[type];
      if (type === 'term') onChange(null);
      else if (['status', 'group', 'assignment', 'project'].includes(type)) onChange('ALL');
      else onChange(null);
    }
  };

  const updateRowType = (id, newType) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, type: newType } : r)));
  };

  const handleReset = () => {
    resetFilters();
    setRows([{ id: Date.now(), type: null }]);
  };

  const activeFiltersCount = [
    statusFilter !== 'ALL',
    groupFilter !== 'ALL',
    assignmentFilter !== 'ALL',
    projectFilter !== 'ALL',
    universityFilter !== undefined && universityFilter !== null,
    majorFilter !== undefined && majorFilter !== null,
    dateFilter !== undefined && dateFilter !== null,
  ].filter(Boolean).length;

  const content = (
    <div className="w-[520px] p-4">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-primary text-xs" />
          <Text strong className="text-slate-700 tracking-tight text-xs">
            {'CONDITION FILTERS'}
          </Text>
        </div>
        <Button
          type="text"
          size="small"
          onClick={handleReset}
          icon={<UndoOutlined className="text-[10px]" />}
          className="text-primary hover:text-primary-hover text-[11px] h-7 px-2"
        >
          {'Clear all'}
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-2 group animate-in slide-in-from-left-2 duration-200"
          >
            {/* Field Picker */}
            <Select
              placeholder="Select field..."
              value={row.type}
              onChange={(val) => updateRowType(row.id, val)}
              className="w-[160px] student-filter-field"
              options={Object.keys(FILTER_CONFIG).map((key) => ({
                label: FILTER_CONFIG[key].label,
                value: key,
                disabled: rows.some((r) => r.type === key && r.id !== row.id),
              }))}
            />

            <Text className="text-slate-400 text-[10px] px-0.5">{'Equal to'}</Text>

            {/* Value Picker */}
            {row.type === 'date' ? (
              <DatePicker
                picker="month"
                placeholder={INTERNSHIP_LIST.FILTERS.DATE_FILTER_PLACEHOLDER}
                value={dateFilter}
                onChange={setDateFilter}
                className="flex-1 student-filter-value"
                allowClear
                format="MM/YYYY"
              />
            ) : (
              <Select
                placeholder="Select value..."
                value={row.type ? FILTER_CONFIG[row.type].value : undefined}
                onChange={row.type ? FILTER_CONFIG[row.type].onChange : undefined}
                disabled={!row.type}
                className="flex-1 student-filter-value"
                options={row.type ? FILTER_CONFIG[row.type].options : []}
                loading={row.type === 'term' && fetchingTerms}
                allowClear
              />
            )}

            {/* Remove Button */}
            <Button
              type="text"
              size="small"
              icon={
                <CloseOutlined className="text-slate-300 group-hover:text-primary text-[10px]" />
              }
              onClick={() => removeRow(row.id, row.type)}
              className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
            />
          </div>
        ))}
      </div>

      <Divider className="my-3" />

      <div className="flex justify-between items-center">
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          onClick={addRow}
          disabled={rows.length >= Object.keys(FILTER_CONFIG).length}
          className="text-primary font-semibold hover:bg-primary/5 rounded-lg px-2 py-1 h-auto text-[12px]"
        >
          {'Add condition'}
        </Button>

        <Button
          type="primary"
          size="small"
          onClick={() => setOpen(false)}
          className="rounded-full px-6 h-8 text-[12px] font-medium btn-primary-gradient"
        >
          {'Done'}
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
      overlayClassName="filter-popover"
    >
      <Button
        className={`flex h-10 items-center gap-2 rounded-full px-5 font-semibold transition-all duration-300 ${
          activeFiltersCount > 0
            ? 'border-primary text-primary bg-primary/5 shadow-md shadow-primary/10'
            : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
        }`}
      >
        <FilterOutlined />
        <span>{'Filter'}</span>
        {activeFiltersCount > 0 && (
          <Tag
            color="error"
            className="mr-0 rounded-full border-none px-1.5 min-w-[22px] text-center font-bold text-[11px] leading-5"
          >
            {activeFiltersCount}
          </Tag>
        )}
        <DownOutlined
          className={`ml-1 text-[9px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </Button>
    </Popover>
  );
};

export default StudentFilters;
