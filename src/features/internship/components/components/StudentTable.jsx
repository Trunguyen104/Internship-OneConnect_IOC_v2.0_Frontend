'use client';

import React from 'react';
import { Typography, Avatar, Tag, Tooltip, Popconfirm, Button } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import AppTable from '@/components/ui/AppTable';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

const { Text } = Typography;

export default function StudentTable({ data, loading, onDelete }) {
  const ROLE_MAP = {
    Member: {
      label: 'Member',
      color: 'default',
    },
    Leader: {
      label: 'Leader',
      color: 'gold',
    },
  };
  const columns = [
    {
      title: STUDENT_LIST_UI.TABLE.STUDENT,
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div className='flex items-center gap-3'>
          <Avatar
            className='border border-[var(--primary-200)] bg-[var(--primary-100)] font-semibold text-[var(--primary-700)]'
            size='large'
          >
            {text ? text.charAt(0).toUpperCase() : <UserOutlined />}
          </Avatar>
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
      render: (role) => {
        const r = ROLE_MAP[role] || { label: 'Unknown', color: 'default' };

        return <Tag color={r.color}>{r.label}</Tag>;
      },
    },
    {
      title: STUDENT_LIST_UI.TABLE.STATUS,
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        // const STATUS_MAP = {
        //   1: { label: 'Registered', style: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
        //   2: { label: 'Onboarded', style: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
        //   3: {
        //     label: 'In Progress',
        //     style: 'bg-emerald-50 text-emerald-600',
        //     dot: 'bg-emerald-500',
        //   },
        //   4: { label: 'Completed', style: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
        //   5: { label: 'Failed', style: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
        // };
        const STATUS_MAP = {
          Registered: {
            label: 'Registered',
            style: 'bg-gray-100 text-gray-600',
            dot: 'bg-gray-400',
          },
          Onboarded: {
            label: 'Onboarded',
            style: 'bg-purple-50 text-purple-600',
            dot: 'bg-purple-500',
          },
          InProgress: {
            label: 'In Progress',
            style: 'bg-emerald-50 text-emerald-600',
            dot: 'bg-emerald-500',
          },
          Completed: {
            label: 'Completed',
            style: 'bg-blue-50 text-blue-600',
            dot: 'bg-blue-500',
          },
          Failed: {
            label: 'Failed',
            style: 'bg-red-50 text-red-600',
            dot: 'bg-red-500',
          },
        };
        const s = STATUS_MAP[status] || {
          label: 'Unknown',
          style: 'bg-gray-100 text-gray-600',
          dot: 'bg-gray-400',
        };

        return (
          <div className='flex items-center gap-2'>
            <span className={`h-2 w-2 rounded-full ${s.dot}`}></span>
            <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${s.style}`}>
              {s.label}
            </span>
          </div>
        );
      },
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
