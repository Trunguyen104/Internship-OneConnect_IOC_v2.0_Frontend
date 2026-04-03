'use client';

import { UserOutlined } from '@ant-design/icons';
import { Empty, Skeleton, Tooltip } from 'antd';
import React from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';
import { TABLE_CELL } from '@/lib/tableStyles';

export default function InternPhaseGroupTab({ data, loading }) {
  const { GROUPS } = INTERN_PHASE_MANAGEMENT;
  const { TABLE } = GROUPS;

  const columns = [
    {
      title: TABLE.COLUMNS.NAME,
      dataIndex: 'groupName',
      key: 'groupName',
      width: '180px',
      render: (text) => (
        <span className={`${TABLE_CELL.primary} font-semibold text-slate-800 truncate block`}>
          {text || TABLE.NOT_ASSIGNED}
        </span>
      ),
    },
    {
      title: TABLE.COLUMNS.PROJECT,
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      width: '200px',
      render: (text) => (
        <Tooltip title={text}>
          <span className={`${TABLE_CELL.secondary} text-xs truncate block`}>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: TABLE.COLUMNS.MENTOR,
      dataIndex: 'mentorName',
      key: 'mentorName',
      width: '150px',
      render: (text) => (
        <span className="text-slate-600 text-xs font-medium">
          {text && text !== '-' ? (
            text
          ) : (
            <span className="opacity-40 italic">{TABLE.NOT_ASSIGNED}</span>
          )}
        </span>
      ),
    },
    {
      title: TABLE.COLUMNS.MEMBERS,
      key: 'numberOfMembers',
      width: '100px',
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <UserOutlined className="text-slate-400 text-xs" />
          <span className="text-slate-600 text-xs font-bold">{record.numberOfMembers ?? 0}</span>
        </div>
      ),
    },
    {
      title: TABLE.COLUMNS.STATUS,
      dataIndex: 'status',
      key: 'status',
      width: '120px',
      align: 'center',
      render: (status) => {
        const statusMap = {
          1: { label: 'Active', variant: 'success-soft' },
          2: { label: 'Inactive', variant: 'default' },
          3: { label: 'Archived', variant: 'warning-soft' },
        };
        const { label, variant } = statusMap[status] || {
          label: status || '-',
          variant: 'default',
        };
        return (
          <Badge variant={variant} size="xs">
            {label}
          </Badge>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
        <Empty
          description={
            <span className="text-slate-400 font-medium">
              {INTERN_PHASE_MANAGEMENT.GROUPS.EMPTY_STATE}
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        minWidth="600px"
        size="small"
        className="mt-0"
      />
    </div>
  );
}
