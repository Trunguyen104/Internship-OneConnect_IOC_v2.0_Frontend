'use client';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { useMemo } from 'react';

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
        render: (_, __, index) => index + 1,
      },
      {
        title: STUDENT_LIST_UI.TABLE.STUDENT,
        width: '300px',
        render: (_, record) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-text text-[15px] font-bold tracking-tight">
                {record.fullName || STUDENT_LIST_UI.DEFAULT.NA}
              </span>
              <span className="text-muted text-[11px] font-medium tracking-wider uppercase">
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
          <span className="text-muted text-sm font-semibold tracking-tight">{text}</span>
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
          <span className="text-text text-sm font-bold">
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
              danger
              type="text"
              icon={<DeleteOutlined />}
              className="text-muted hover:bg-danger-surface hover:text-danger rounded-lg transition-colors"
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
