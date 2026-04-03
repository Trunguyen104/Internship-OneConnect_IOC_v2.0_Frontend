'use client';

import { Empty, Skeleton } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

export default function InternPhaseStudentTab({ data, loading, DETAILS }) {
  const { STUDENTS } = INTERN_PHASE_MANAGEMENT;
  const { TABLE } = STUDENTS;

  const columns = [
    {
      title: TABLE.COLUMNS.NAME,
      key: 'fullName',
      dataIndex: 'fullName',
      width: '180px',
      render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: TABLE.COLUMNS.UNIVERSITY,
      key: 'universityName',
      dataIndex: 'universityName',
      width: '150px',
      render: (text) => (
        <span className="text-slate-600 italic text-xs">
          {text && text.trim() ? text : INTERN_PHASE_MANAGEMENT.MESSAGES.DASH}
        </span>
      ),
    },
    {
      title: TABLE.COLUMNS.SOURCE,
      key: 'source',
      width: '120px',
      align: 'center',
      render: (source) => {
        const variant = TABLE.SOURCE_VARIANTS[source] || 'default';
        const label =
          TABLE.SOURCE_LABELS[source] || source || INTERN_PHASE_MANAGEMENT.MESSAGES.DASH;

        return (
          <Badge variant={variant} size="xs">
            {label}
          </Badge>
        );
      },
    },
    {
      title: TABLE.COLUMNS.PLACED_DATE,
      key: 'placedAt',
      dataIndex: 'placedAt',
      width: '120px',
      render: (text) =>
        text ? dayjs(text).format('DD/MM/YYYY') : INTERN_PHASE_MANAGEMENT.MESSAGES.DASH,
    },
  ];

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center py-10">
        <Empty description={DETAILS.EMPTY_STUDENTS} />
      </div>
    );
  }

  return (
    <div className="h-[400px] overflow-hidden flex flex-col">
      <DataTable
        columns={columns}
        data={data}
        rowKey={(record) => record.studentId || record.id}
        minWidth="500px"
        size="small"
        className="mt-0"
      />
    </div>
  );
}
