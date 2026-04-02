'use client';

import { DeleteOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import { TABLE_CELL } from '@/lib/tableStyles';

import StudentRoleTag from './StudentRoleTag';
import StudentStatusTag from './StudentStatusTag';

export default function StudentTable({ data, loading, onDelete }) {
  const columns = useMemo(
    () => [
      {
        title: STUDENT_LIST_UI.TABLE.INDEX,
        key: '_index',
        width: '60px',
        render: (_, __, index) => <span className={TABLE_CELL.rowIndex}>{index + 1}</span>,
      },
      {
        title: STUDENT_LIST_UI.TABLE.STUDENT,
        key: 'fullName',
        width: '300px',
        render: (_, record) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className={TABLE_CELL.title}>
                {record.fullName || STUDENT_LIST_UI.DEFAULT.NA}
              </span>
              <span className={TABLE_CELL.meta}>{record.email}</span>
            </div>
          </div>
        ),
      },
      {
        title: STUDENT_LIST_UI.TABLE.CODE,
        key: 'studentCode',
        render: (text) => <span className={TABLE_CELL.secondary}>{text}</span>,
      },
      {
        title: STUDENT_LIST_UI.TABLE.ROLE,
        key: 'role',
        render: (_, record) => <StudentRoleTag role={record.role} />,
      },
      {
        title: STUDENT_LIST_UI.TABLE.STATUS,
        key: 'status',
        width: '150px',
        render: (_, record) => <StudentStatusTag status={record.status} />,
      },
      {
        title: STUDENT_LIST_UI.TABLE.JOINED_AT,
        key: 'joinedAt',
        render: (_, record) => (
          <span className={TABLE_CELL.primary}>
            {record.joinedAt
              ? new Date(record.joinedAt).toLocaleDateString('en-GB')
              : STUDENT_LIST_UI.DEFAULT.NA}
          </span>
        ),
      },
      {
        title: '',
        key: 'actions',
        align: 'right',
        width: '48px',
        render: (_, record) => {
          const items = [
            {
              key: 'remove',
              label: STUDENT_LIST_UI.ACTION.REMOVE_STUDENT,
              icon: <DeleteOutlined />,
              danger: true,
              disabled: !record.studentId,
              onClick: () => {
                if (!record.studentId) return;
                showDeleteConfirm({
                  title: STUDENT_LIST_UI.CONFIRM.REMOVE_TITLE,
                  content: STUDENT_LIST_UI.CONFIRM.REMOVE_DESC,
                  onOk: () => onDelete(record.studentId),
                });
              },
            },
          ];

          return (
            <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
              <TableRowDropdown items={items} />
            </div>
          );
        },
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
        minWidth="auto"
      />
    </div>
  );
}
