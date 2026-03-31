'use client';

import {
  CheckSquareFilled,
  CheckSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import Badge from '@/components/ui/badge';
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
            <div className="flex items-center gap-1 overflow-hidden">
              {displayMajors.map((m, i) => {
                const majorName = m.trim();
                return (
                  <Tooltip key={i} title={majorName}>
                    <Badge
                      variant="primary-soft"
                      size="xs"
                      className="inline-block max-w-[100px] truncate"
                    >
                      {majorName}
                    </Badge>
                  </Tooltip>
                );
              })}
              {remaining > 0 && (
                <Tooltip title={majors.slice(2).join(', ')}>
                  <Badge variant="default" size="xs" className="flex-shrink-0 cursor-help">
                    +{remaining}
                  </Badge>
                </Tooltip>
              )}
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.TIMELINE,
        key: 'timeline',
        width: '180px',
        render: (_, record) => (
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="whitespace-nowrap">
              {dayjs(record.startDate).format('DD/MM/YYYY')}
            </span>
            <span className="opacity-40">-</span>
            <span className="whitespace-nowrap">{dayjs(record.endDate).format('DD/MM/YYYY')}</span>
          </div>
        ),
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
          <Tooltip title={FILTERS.INCLUDE_ENDED}>
            <div
              onClick={() => setIncludeEnded(!includeEnded)}
              className={`flex items-center gap-2 cursor-pointer transition-all px-3 py-1.5 rounded-full border ${
                includeEnded
                  ? 'bg-red-50 border-red-100 text-red-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
              }`}
            >
              {includeEnded ? (
                <CheckSquareFilled className="text-red-600" />
              ) : (
                <CheckSquareOutlined className="text-slate-300" />
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider select-none">
                {FILTERS.INCLUDE_ENDED}
              </span>
            </div>
          </Tooltip>
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
