'use client';

import { Empty, Skeleton } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';

export default function InternPhaseStudentTab({ data, loading, DETAILS }) {
  const { STUDENTS } = INTERN_PHASE_MANAGEMENT;
  const { TABLE } = STUDENTS;

  const columns = [
    {
      title: TABLE.COLUMNS.NAME,
      key: 'studentName',
      width: '180px',
      render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: TABLE.COLUMNS.UNIVERSITY,
      key: 'universityName',
      width: '150px',
      render: (text) => <span className="text-slate-600 italic text-xs">{text}</span>,
    },
    {
      title: TABLE.COLUMNS.SOURCE,
      key: 'source',
      width: '120px',
      align: 'center',
      render: (source) => {
        const displaySource = typeof source === 'object' ? source?.name || source?.label : source;
        const variant = TABLE.SOURCE_VARIANTS[displaySource] || 'default';
        const label = TABLE.SOURCE_LABELS[displaySource] || displaySource || '-';

        return (
          <Badge variant={variant} size="xs">
            {label}
          </Badge>
        );
      },
    },
    {
      title: TABLE.COLUMNS.PLACED_DATE,
      key: 'placedDate',
      width: '120px',
      render: (text) => (text ? dayjs(text).format('DD/MM/YYYY') : '-'),
    },
  ];

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} className="mt-4" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Empty description={DETAILS.EMPTY_STUDENTS} />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <DataTable columns={columns} data={data} rowKey="id" minWidth="500px" size="small" />
    </div>
  );
}
