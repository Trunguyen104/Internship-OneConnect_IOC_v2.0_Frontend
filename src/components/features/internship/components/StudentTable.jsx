'use client';

import React from 'react';
import { Typography, Tooltip, Popconfirm, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import StudentStatusTag from './StudentStatusTag';
import StudentRoleTag from './StudentRoleTag';
import StudentAvatar from './StudentAvatar';
import AppTable from '@/components/ui/AppTable';
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
            <Text className='text-[15px] font-semibold text-gray-900'>
              {text || STUDENT_LIST_UI.DEFAULT.NA}
            </Text>

            <Text className='text-[13px] text-gray-500'>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: STUDENT_LIST_UI.TABLE.CODE,
      dataIndex: 'studentCode',
      key: 'studentCode',
      render: (text) => <Text className='font-medium text-gray-600'>{text}</Text>,
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
        <span className='text-sm text-gray-500'>
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
          <Popconfirm
            title={STUDENT_LIST_UI.CONFIRM.REMOVE_TITLE}
            description={STUDENT_LIST_UI.CONFIRM.REMOVE_DESC}
            onConfirm={() => onDelete(record.studentId)}
            okText={STUDENT_LIST_UI.CONFIRM.YES}
            cancelText={STUDENT_LIST_UI.CONFIRM.NO}
            okButtonProps={{ danger: true, shape: 'round' }}
            cancelButtonProps={{ shape: 'round' }}
            placement='topLeft'
          >
            <Button
              danger
              type='text'
              icon={<DeleteOutlined />}
              className='rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500'
            />
          </Popconfirm>
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
