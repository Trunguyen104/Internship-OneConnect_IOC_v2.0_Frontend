'use client';

import { DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

import StudentRoleTag from './StudentRoleTag';
import StudentStatusTag from './StudentStatusTag';

export default function StudentTable({ data, loading, onDelete }) {
  const columns = useMemo(
    () => [
      {
        title: STUDENT_LIST_UI.TABLE.INDEX,
        width: '60px',
        render: (_, __, index) => <span className="text-gray-500 font-medium">{index + 1}</span>,
      },
      {
        title: STUDENT_LIST_UI.TABLE.STUDENT,
        width: '300px',
        render: (_, record) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-gray-900 text-[15px] font-bold tracking-tight">
                {record.fullName || STUDENT_LIST_UI.DEFAULT.NA}
              </span>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">
                {record.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: STUDENT_LIST_UI.TABLE.CODE,
        key: 'studentCode',
        render: (text) => (
          <span className="text-gray-500 text-sm font-semibold tracking-tight">{text}</span>
        ),
      },
      {
        title: STUDENT_LIST_UI.TABLE.ROLE,
        render: (_, record) => <StudentRoleTag role={record.role} />,
      },
      {
        title: STUDENT_LIST_UI.TABLE.STATUS,
        width: '150px',
        render: (_, record) => <StudentStatusTag status={record.status} />,
      },
      {
        title: STUDENT_LIST_UI.TABLE.JOINED_AT,
        render: (_, record) => (
          <span className="text-gray-900 text-sm font-bold">
            {record.joinedAt
              ? new Date(record.joinedAt).toLocaleDateString('en-GB')
              : STUDENT_LIST_UI.DEFAULT.NA}
          </span>
        ),
      },
      {
        title: '',
        align: 'right',
        render: (_, record) => (
          <Tooltip title={STUDENT_LIST_UI.ACTION.REMOVE_STUDENT}>
            <Button
              variant="danger-ghost"
              size="sm"
              icon={<DeleteOutlined />}
              onClick={() => {
                if (!record.studentId) return;
                showDeleteConfirm({
                  title: STUDENT_LIST_UI.CONFIRM.REMOVE_TITLE,
                  content: STUDENT_LIST_UI.CONFIRM.REMOVE_DESC,
                  onOk: () => onDelete(record.studentId),
                });
              }}
              disabled={!record.studentId}
            />
          </Tooltip>
        ),
      },
    ],
    [onDelete]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyText={STUDENT_LIST_UI.EMPTY.NO_MEMBERS}
        rowKey="studentId"
      />
    </div>
  );
}
