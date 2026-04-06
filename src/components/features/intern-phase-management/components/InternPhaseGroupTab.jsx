'use client';

import { UserOutlined } from '@ant-design/icons';
import { Empty, Skeleton } from 'antd';
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
      width: '35%',
      render: (text) => (
        <span className={`${TABLE_CELL.primary} font-semibold text-slate-800 truncate block`}>
          {text || TABLE.NOT_ASSIGNED}
        </span>
      ),
    },
    {
      title: TABLE.COLUMNS.MENTOR,
      dataIndex: 'mentorName',
      key: 'mentorName',
      width: '30%',
      render: (text) => (
        <span className="text-slate-600 font-medium">
          {text && text !== INTERN_PHASE_MANAGEMENT.MESSAGES.DASH ? (
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
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <UserOutlined className="text-slate-400" />
          <span className="text-slate-600 font-bold">{record.numberOfMembers ?? 0}</span>
        </div>
      ),
    },
    {
      title: TABLE.COLUMNS.STATUS,
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      align: 'center',
      render: (status) => {
        const label =
          TABLE.STATUS_LABELS[status] || status || INTERN_PHASE_MANAGEMENT.MESSAGES.DASH;
        const variant = TABLE.STATUS_VARIANTS[status] || 'default';
        return (
          <Badge variant={variant} size="sm">
            {label}
          </Badge>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden p-8">
        <Skeleton active paragraph={{ rows: 6 }} className="w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
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
    <div className="flex-1 flex flex-col">
      <DataTable columns={columns} data={data} rowKey="id" minWidth="600px" className="mt-0" />
    </div>
  );
}
