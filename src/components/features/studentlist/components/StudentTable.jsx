'use client';

import React from 'react';
import { Typography, Tooltip, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import StudentStatusTag from './StudentStatusTag';
import StudentRoleTag from './StudentRoleTag';
import StudentAvatar from './StudentAvatar';
import AppTable from '@/components/ui/AppTable';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
const { Text } = Typography;

export default function StudentTable({ data, loading, onDelete }) {
  const columns = [
    {
      title: STUDENT_LIST_UI.TABLE.STUDENT,
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div className='flex items-center gap-3'>
          <StudentAvatar name={text} />

          <div className='flex flex-col'>
            <Text className='text-text text-[15px] font-semibold'>
              {text || STUDENT_LIST_UI.DEFAULT.NA}
            </Text>

            <Text className='text-muted text-[13px]'>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: STUDENT_LIST_UI.TABLE.CODE,
      dataIndex: 'studentCode',
      key: 'studentCode',
      render: (text) => <Text className='text-muted font-medium'>{text}</Text>,
    },
    {
      title: STUDENT_LIST_UI.TABLE.ROLE,
      dataIndex: 'role',
      key: 'role',
      render: (role) => <StudentRoleTag role={role} />,
    },
    {
      title: STUDENT_LIST_UI.TABLE.STATUS,
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StudentStatusTag status={status} />,
    },
    {
      title: STUDENT_LIST_UI.TABLE.JOINED_AT,
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date) => (
        <span className='text-muted text-sm'>
          {date ? new Date(date).toLocaleDateString('en-GB') : STUDENT_LIST_UI.DEFAULT.NA}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Tooltip title={STUDENT_LIST_UI.ACTION.REMOVE_STUDENT}>
          <Button
            danger
            type='text'
            icon={<DeleteOutlined />}
            className='text-muted hover:bg-danger-surface hover:text-danger rounded-lg transition-colors'
            onClick={() =>
              showDeleteConfirm({
                title: STUDENT_LIST_UI.CONFIRM.REMOVE_TITLE,
                content: STUDENT_LIST_UI.CONFIRM.REMOVE_DESC,
                onOk: () => onDelete(record.studentId),
              })
            }
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className='overflow-hidden rounded-xl'>
      <AppTable
        columns={columns}
        data={data}
        rowKey='studentId'
        loading={loading}
        emptyText={STUDENT_LIST_UI.EMPTY.NO_MEMBERS}
        pagination={false}
      />
    </div>
  );
}
