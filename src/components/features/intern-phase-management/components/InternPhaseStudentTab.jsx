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
      width: '30%',
      render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: TABLE.COLUMNS.UNIVERSITY,
      key: 'universityName',
      dataIndex: 'universityName',
      width: '35%',
      render: (text) => (
        <span className="text-slate-600 italic text-sm">
          {text && text.trim() ? text : INTERN_PHASE_MANAGEMENT.MESSAGES.DASH}
        </span>
      ),
    },
    {
      title: TABLE.COLUMNS.SOURCE,
      key: 'source',
      width: '15%',
      align: 'center',
      render: (source) => {
        const variant = TABLE.SOURCE_VARIANTS[source] || 'default';
        const label =
          TABLE.SOURCE_LABELS[source] || source || INTERN_PHASE_MANAGEMENT.MESSAGES.DASH;

        return (
          <Badge variant={variant} size="sm">
            {label}
          </Badge>
        );
      },
    },
    {
      title: TABLE.COLUMNS.PLACED_DATE,
      key: 'placedAt',
      dataIndex: 'placedAt',
      width: '20%',
      render: (text) =>
        text ? dayjs(text).format('DD/MM/YYYY') : INTERN_PHASE_MANAGEMENT.MESSAGES.DASH,
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Skeleton active paragraph={{ rows: 8 }} className="w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <Empty description={DETAILS.EMPTY_STUDENTS} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        rowKey={(record) => record.studentId || record.id}
        minWidth="500px"
        className="mt-0"
      />
    </div>
  );
}
