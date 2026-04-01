'use client';

import { Empty, Skeleton } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import DataTable from '@/components/ui/datatable';
import StatusBadge from '@/components/ui/status-badge';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

export default function InternPhaseJobPostingTab({ data, loading, DETAILS }) {
  const { JOB_POSTING } = INTERN_PHASE_MANAGEMENT;
  const { TABLE } = JOB_POSTING;

  const columns = [
    {
      title: TABLE.COLUMNS.TITLE,
      key: 'title',
      width: '200px',
      render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: TABLE.COLUMNS.STATUS,
      key: 'status',
      width: '120px',
      align: 'center',
      render: (status) => {
        const displayStatus = typeof status === 'object' ? status?.name || status?.label : status;
        const label = TABLE.STATUS_LABELS[displayStatus] || displayStatus || '-';

        const variant =
          displayStatus === 'Published'
            ? 'success'
            : displayStatus === 'Draft'
              ? 'warning'
              : 'neutral';

        return (
          <StatusBadge variant={variant} label={label} pulseDot={displayStatus === 'Published'} />
        );
      },
    },
    {
      title: TABLE.COLUMNS.DEADLINE,
      key: 'deadline',
      width: '120px',
      render: (text) => (text ? dayjs(text).format('DD/MM/YYYY') : '-'),
    },
    {
      title: TABLE.COLUMNS.APPLICATIONS,
      key: 'applicationCount',
      width: '120px',
      align: 'center',
      render: (count) => <span className="font-medium text-slate-600">{count || 0}</span>,
    },
  ];

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} className="mt-4" />;
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Empty description={DETAILS.EMPTY_POSTINGS} />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <DataTable columns={columns} data={data} rowKey="id" minWidth="500px" size="small" />
    </div>
  );
}
