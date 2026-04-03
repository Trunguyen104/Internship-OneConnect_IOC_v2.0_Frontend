'use client';

import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import StatusBadge from '@/components/ui/status-badge';
import {
  INTERN_PHASE_MANAGEMENT,
  INTERN_PHASE_STATUS,
  INTERN_PHASE_STATUS_LABELS,
  INTERN_PHASE_STATUS_VARIANTS,
} from '@/constants/intern-phase-management/intern-phase';

import PhasePostingCell from './PhasePostingCell';

export default function InternPhaseTable({ items, loading, onView, onEdit, onDelete }) {
  const { TABLE } = INTERN_PHASE_MANAGEMENT;

  const columns = useMemo(
    () => [
      {
        title: TABLE.COLUMNS.NAME,
        key: 'name',
        width: '240px',
        render: (text) => (
          <span className="font-bold text-slate-800 tracking-tight hover:text-primary transition-colors cursor-default">
            {text}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.MAJORS,
        key: 'majorFields',
        width: '220px',
        render: (text) => {
          if (!text) return INTERN_PHASE_MANAGEMENT.MESSAGES.DASH;
          const majors = typeof text === 'string' ? text.split(',') : text;
          const firstMajor = majors[0];
          const remainingCount = majors.length - 1;

          // Simple hash-based color selection for a premium "vibrant" feel
          const colors = [
            'primary-soft',
            'success-soft',
            'warning-soft',
            'info-soft',
            'indigo-soft',
          ];
          const colorIndex =
            Math.abs(firstMajor.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
            colors.length;
          const variant = colors[colorIndex];

          return (
            <div className="flex items-center gap-2">
              <Tooltip title={majors.join(', ')}>
                <Badge
                  variant={variant}
                  size="sm"
                  className="max-w-[150px] truncate font-bold tracking-tight"
                >
                  {firstMajor}
                </Badge>
              </Tooltip>
              {remainingCount > 0 && (
                <Tooltip title={majors.slice(1).join(', ')}>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 ring-4 ring-white shadow-sm transition-all hover:scale-110 hover:bg-slate-200 cursor-help">
                    {INTERN_PHASE_MANAGEMENT.MESSAGES.PLUS}
                    {remainingCount}
                  </div>
                </Tooltip>
              )}
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.TIMELINE,
        key: 'timeline',
        width: '170px',
        render: (_, record) => (
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="whitespace-nowrap">
              {dayjs(record.startDate).format('DD/MM/YYYY')}
            </span>
            <span className="opacity-40">{INTERN_PHASE_MANAGEMENT.MESSAGES.DASH}</span>
            <span className="whitespace-nowrap">{dayjs(record.endDate).format('DD/MM/YYYY')}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'status',
        width: '100px',
        align: 'center',
        render: (status) => {
          const variant = INTERN_PHASE_STATUS_VARIANTS[status] || 'default';
          const label =
            INTERN_PHASE_STATUS_LABELS[status] || INTERN_PHASE_MANAGEMENT.MESSAGES.UNKNOWN;

          return (
            <StatusBadge
              variant={variant}
              label={label}
              pulseDot={status === INTERN_PHASE_STATUS.ACTIVE}
            />
          );
        },
      },
      {
        title: TABLE.COLUMNS.POSTINGS,
        key: 'jobPostingCount',
        width: '110px',
        align: 'center',
        render: (_, record) => {
          const initialCount =
            record.jobPostingCount ??
            record.jobPostingsCount ??
            record.totalJobPostings ??
            record.totalJobPosting ??
            record.postingsCount ??
            record.postingCount ??
            record.jobCount ??
            record.totalJobs ??
            record.jobPostings?.length ??
            0;

          return (
            <PhasePostingCell
              initialCount={initialCount}
              phaseId={record.id || record.phaseId || record.internPhaseId}
            />
          );
        },
      },
      {
        title: TABLE.COLUMNS.CAPACITY,
        key: 'capacity',
        width: '100px',
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
              disabled: record.status === INTERN_PHASE_STATUS.ENDED,
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
    <div className="flex flex-1 min-h-0 flex-col h-full">
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
