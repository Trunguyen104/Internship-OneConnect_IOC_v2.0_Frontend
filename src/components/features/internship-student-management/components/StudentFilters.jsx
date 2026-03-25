'use client';

import {
  CloseOutlined,
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Divider, Popover, Select, Typography } from 'antd';
import React, { useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

export const StudentFilters = ({
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  groupFilter,
  setGroupFilter,
  mentorFilter,
  setMentorFilter,
  resetFilters,
}) => {
  const [open, setOpen] = useState(false);
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;

  const FILTER_CONFIG = {
    date: {
      label: 'Month / Year (Placed)',
      value: dateFilter,
      onChange: setDateFilter,
    },
    status: {
      label: 'Placed Status',
      options: [
        { label: 'Pending', value: 1 },
        { label: 'Accepted', value: 2 },
        { label: 'Rejected', value: 3 },
      ],
      value: statusFilter === 'ALL' ? undefined : statusFilter,
      onChange: setStatusFilter,
    },
    group: {
      label: 'Group Status',
      options: [
        { label: 'Has Group', value: 'HAS_GROUP' },
        { label: 'No Group', value: 'NO_GROUP' },
      ],
      value: groupFilter === 'ALL' ? undefined : groupFilter,
      onChange: setGroupFilter,
    },
    mentor: {
      label: 'Mentor Assignment',
      options: [
        { label: 'Assigned', value: 'HAS_MENTOR' },
        { label: 'Unassigned', value: 'NO_MENTOR' },
      ],
      value: mentorFilter === 'ALL' ? undefined : mentorFilter,
      onChange: setMentorFilter,
    },
  };

  const [rows, setRows] = useState(() => {
    const active = [];
    if (dateFilter) active.push({ id: 'date', type: 'date' });
    if (statusFilter !== 'ALL' && statusFilter !== undefined)
      active.push({ id: 'status', type: 'status' });
    if (groupFilter !== 'ALL') active.push({ id: 'group', type: 'group' });
    if (mentorFilter !== 'ALL') active.push({ id: 'mentor', type: 'mentor' });

    return active.length > 0 ? active : [{ id: Date.now(), type: null }];
  });

  const addRow = () => {
    setRows([...rows, { id: Date.now(), type: null }]);
  };

  const removeRow = (id, type) => {
    setRows(rows.filter((r) => r.id !== id));
    if (type && FILTER_CONFIG[type]) {
      const { onChange } = FILTER_CONFIG[type];
      if (['status', 'group', 'mentor'].includes(type)) onChange('ALL');
      else onChange(undefined);
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
    dateFilter !== undefined && dateFilter !== null,
    statusFilter !== 'ALL' && statusFilter !== undefined,
    groupFilter !== 'ALL',
    mentorFilter !== 'ALL',
  ].filter(Boolean).length;

  const content = (
    <div className="w-[400px] p-2">
      <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-primary text-xs" />
          <Text strong className="text-slate-700 tracking-tight text-xs uppercase">
            {INTERNSHIP_LIST.FILTERS.BUILDER_TITLE}
          </Text>
        </div>
        <Button
          type="text"
          size="small"
          onClick={handleReset}
          icon={<UndoOutlined className="text-[10px]" />}
          className="text-primary hover:text-primary-hover text-[11px] h-7 px-2"
        >
          {INTERNSHIP_LIST.FILTERS.CLEAR_ALL}
        </Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-2 group animate-in slide-in-from-left-2 duration-200"
          >
            <Select
              placeholder={INTERNSHIP_LIST.FILTERS.SELECT_FIELD}
              value={row.type}
              onChange={(val) => updateRowType(row.id, val)}
              className="w-[140px] student-filter-field"
              options={Object.keys(FILTER_CONFIG).map((key) => ({
                label: FILTER_CONFIG[key].label,
                value: key,
                disabled: rows.some((r) => r.type === key && r.id !== row.id),
              }))}
            />

            <Text className="text-slate-400 text-[10px] px-0.5 whitespace-nowrap">
              {INTERNSHIP_LIST.FILTERS.EQUAL_TO}
            </Text>

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
                showSearch
                optionFilterProp="label"
                placeholder={INTERNSHIP_LIST.FILTERS.SELECT_VALUE}
                value={row.type ? FILTER_CONFIG[row.type].value : undefined}
                onChange={row.type ? FILTER_CONFIG[row.type].onChange : undefined}
                disabled={!row.type}
                className="flex-1 student-filter-value"
                options={row.type ? FILTER_CONFIG[row.type].options : []}
                loading={row.type === 'phase' && fetchingPhases}
                allowClear
              />
            )}

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

      <Divider className="my-1.5" />

      <div className="flex justify-between items-center">
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          onClick={addRow}
          disabled={rows.length >= Object.keys(FILTER_CONFIG).length}
          className="text-primary font-semibold hover:bg-primary/5 rounded-lg px-2 py-1 h-auto text-[12px]"
        >
          {INTERNSHIP_LIST.FILTERS.ADD_CONDITION}
        </Button>

        <Button
          type="primary"
          size="small"
          onClick={() => setOpen(false)}
          className="rounded-full px-6 h-8 text-[12px] font-medium btn-primary-gradient"
        >
          {INTERNSHIP_LIST.FILTERS.FINISH}
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
        <span>{INTERNSHIP_LIST.FILTERS.FILTER_TITLE}</span>
        <DownOutlined
          className={`ml-1 text-[9px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </Button>
    </Popover>
  );
};

export default StudentFilters;
