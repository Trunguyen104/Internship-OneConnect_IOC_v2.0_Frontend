'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import Badge from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import {
  INTERN_PHASE_MANAGEMENT,
  INTERN_PHASE_STATUS_LABELS,
  INTERN_PHASE_STATUS_VARIANTS,
} from '@/constants/intern-phase-management/intern-phase';

export default function InternPhaseTable({
  items,
  loading,
  search,
  setSearch,
  includeEnded,
  setIncludeEnded,
  onView,
  onEdit,
  onDelete,
  onCreate,
}) {
  const { TABLE, SEARCH_PLACEHOLDER, FILTERS, CREATE_BTN } = INTERN_PHASE_MANAGEMENT;

  const columns = useMemo(
    () => [
      {
        title: TABLE.COLUMNS.NAME,
        key: 'name',
        width: '200px',
        render: (text) => (
          <span
            className="block truncate font-semibold text-slate-800 whitespace-nowrap"
            title={text}
          >
            {text}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.MAJORS,
        key: 'majorFields',
        width: '200px',
        render: (text) => {
          const majors = typeof text === 'string' ? text.split(',').filter(Boolean) : [];
          const displayMajors = majors.slice(0, 2);
          const remaining = majors.length - displayMajors.length;

          return (
            <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
              {displayMajors.map((m, i) => (
                <Badge key={i} variant="primary-soft" size="xs" className="flex-shrink-0">
                  {m.trim()}
                </Badge>
              ))}
              {remaining > 0 && (
                <Badge variant="default" size="xs" className="flex-shrink-0">
                  +{remaining}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.START_DATE,
        key: 'startDate',
        width: '100px',
        render: (text) => dayjs(text).format('DD/MM/YYYY'),
      },
      {
        title: TABLE.COLUMNS.END_DATE,
        key: 'endDate',
        width: '100px',
        render: (text) => dayjs(text).format('DD/MM/YYYY'),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'computedStatus',
        width: '100px',
        align: 'center',
        render: (status) => (
          <Badge variant={INTERN_PHASE_STATUS_VARIANTS[status]} size="sm">
            {INTERN_PHASE_STATUS_LABELS[status]}
          </Badge>
        ),
      },
      {
        title: TABLE.COLUMNS.POSTINGS,
        key: 'jobPostingCount',
        width: '80px',
        align: 'center',
        render: (count) => <span className="font-medium">{count || 0}</span>,
      },
      {
        title: TABLE.COLUMNS.CAPACITY,
        key: 'capacity',
        width: '110px',
        align: 'center',
        render: (_, record) => {
          const total = record.capacity || 0;
          const remaining = record.remainingCapacity ?? total;
          return (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-primary">
                {TABLE.CAPACITY_FORMAT.replace('{remaining}', remaining).replace('{total}', total)}
              </span>
              <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, (remaining / total) * 100))}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: '80px',
        align: 'center',
        render: (_, record) => {
          const actionItems = [
            {
              key: 'view',
              label: TABLE.ACTIONS.VIEW,
              icon: <EyeOutlined />,
              onClick: () => onView(record),
            },
            {
              key: 'edit',
              label: TABLE.ACTIONS.EDIT,
              icon: <EditOutlined />,
              disabled: record.computedStatus === 'ENDED',
              onClick: () => onEdit(record),
            },
            {
              key: 'delete',
              label: TABLE.ACTIONS.DELETE,
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => onDelete(record),
            },
          ];

          return (
            <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 italic font-bold text-xl leading-none">
                <MoreOutlined />
              </div>
            </Dropdown>
          );
        },
      },
    ],
    [TABLE, onView, onEdit, onDelete]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTableToolbar>
        <DataTableToolbar.Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
        />
        <DataTableToolbar.Filters>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 bg-white">
            <Checkbox
              id="include-ended"
              checked={includeEnded}
              onChange={(e) => setIncludeEnded(e.target.checked)}
            />
            <label
              htmlFor="include-ended"
              className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
            >
              {FILTERS.INCLUDE_ENDED}
            </label>
          </div>
        </DataTableToolbar.Filters>
        <DataTableToolbar.Actions
          label={CREATE_BTN}
          icon={<PlusOutlined />}
          onClick={onCreate}
          className="ml-auto"
        />
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        rowKey="id"
        size="small"
        minWidth="950px"
      />
    </div>
  );
}
