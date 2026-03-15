'use client';

import React, { useMemo } from 'react';
import { Table, Avatar, Dropdown, Button, Tag } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  TeamOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { STATUS_CONFIG, MOCK_MENTORS } from '../constants/internshipData';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const InternshipTable = ({ data, loading, onAccept, onReject, onAssign, onGroup }) => {
  const { TABLE, ACTIONS } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const columns = useMemo(
    () => [
      {
        title: <span className='tracking-wider'>{TABLE.COLUMNS.FULL_NAME}</span>,
        dataIndex: 'fullName',
        key: 'fullName',
        width: 220,
        render: (text, record) => {
          const initials = text
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          return (
            <div className='flex items-center gap-3'>
              <Avatar
                size={36}
                src={record.avatar?.startsWith('http') ? record.avatar : null}
                className={`border-surface border-2 shadow-sm ${
                  !record.avatar?.startsWith('http')
                    ? 'bg-primary/10 text-primary text-[10px] font-bold'
                    : ''
                }`}
              >
                {!record.avatar?.startsWith('http') ? initials : null}
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-text truncate text-sm font-bold'>{text}</span>
                <span className='text-muted text-[10px] font-medium'>{record.major}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.STUDENT_ID,
        dataIndex: 'studentId',
        key: 'studentId',
        width: 100,
        className: 'text-muted font-mono text-xs',
      },
      {
        title: TABLE.COLUMNS.EMAIL,
        dataIndex: 'email',
        key: 'email',
        width: 200,
        className: 'text-muted truncate text-xs font-medium',
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: 140,
        align: 'center',
        render: (status) => {
          const config = STATUS_CONFIG[status];
          return (
            <Tag
              color={config?.color || 'default'}
              variant='filled'
              className='min-w-[90px] rounded-full py-0.5 text-[10px] font-black tracking-widest uppercase'
            >
              {config?.label || status}
            </Tag>
          );
        },
      },
      {
        title: TABLE.COLUMNS.MENTOR,
        dataIndex: 'mentorId',
        key: 'mentor',
        width: 180,
        render: (id) => {
          const mentor = MOCK_MENTORS.find((m) => m.id === id);
          return mentor ? (
            <div className='flex items-center gap-2'>
              <div className='bg-primary/10 h-1.5 w-1.5 rounded-full' />
              <span className='text-text text-xs font-bold'>{mentor.name}</span>
            </div>
          ) : (
            <span className='text-muted text-xs italic opacity-50'>{TABLE.NOT_ASSIGNED}</span>
          );
        },
      },
      {
        title: <span className='pr-4'>{TABLE.COLUMNS.ACTIONS}</span>,
        key: 'actions',
        width: 80,
        align: 'right',
        render: (_, record) => {
          const items = [];

          if (record.status === 'PENDING') {
            items.push(
              {
                key: 'accept',
                label: <span className='font-semibold'>{ACTIONS.ACCEPT}</span>,
                icon: <CheckOutlined className='text-success' />,
                onClick: () => onAccept(record),
              },
              {
                key: 'reject',
                label: <span className='font-semibold'>{ACTIONS.REJECT}</span>,
                icon: <CloseOutlined className='text-danger' />,
                onClick: () => onReject(record),
              },
            );
          }

          if (record.status === 'ACCEPTED') {
            items.push(
              {
                key: 'assign',
                label: <span className='font-semibold'>{ACTIONS.ASSIGN}</span>,
                icon: <UserOutlined className='text-primary' />,
                onClick: () => onAssign(record),
              },
              {
                key: 'group',
                icon: <TeamOutlined className='text-primary' />,
                label: (
                  <span className='font-semibold'>
                    {record.groupId ? ACTIONS.CHANGE_GROUP : ACTIONS.ADD_TO_GROUP}
                  </span>
                ),
                onClick: () => onGroup(record),
              },
            );
          }

          items.push(
            { type: 'divider' },
            {
              key: 'details',
              label: <span className='font-semibold'>{ACTIONS.VIEW_BIO}</span>,
              icon: <EyeOutlined className='text-muted' />,
            },
          );

          return (
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement='bottomRight'
              overlayClassName='min-w-[200px] rounded-xl overflow-hidden shadow-xl border border-border'
            >
              <Button
                type='text'
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                icon={<MoreOutlined className='text-xl' />}
              />
            </Dropdown>
          );
        },
      },
    ],
    [onAccept, onReject, onAssign, onGroup, TABLE, ACTIONS],
  );

  return (
    <div className='flex-1 overflow-hidden px-2'>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ y: 'calc(100vh - 460px)' }}
        pagination={false}
        className='premium-table'
        rowClassName={(record) =>
          `group transition-all duration-200 hover:bg-muted/5 cursor-default ${
            record.status === 'REJECTED' ? 'opacity-60' : ''
          }`
        }
        locale={{ emptyText: TABLE.EMPTY_TEXT }}
        rowKey='id'
      />
    </div>
  );
};

export default InternshipTable;
