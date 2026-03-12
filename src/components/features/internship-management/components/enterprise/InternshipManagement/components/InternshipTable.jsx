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

const InternshipTable = ({ data, loading, onAccept, onReject, onAssign, onGroup }) => {
  const columns = useMemo(
    () => [
      {
        title: 'FULL NAME',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 220,
        render: (text, record) => (
          <div className='flex items-center gap-2'>
            <Avatar
              size='small'
              src={record.avatar.startsWith('http') ? record.avatar : null}
              className={
                !record.avatar.startsWith('http')
                  ? 'bg-primary/10 text-primary text-[10px] font-bold'
                  : ''
              }
            >
              {!record.avatar.startsWith('http') ? record.avatar : null}
            </Avatar>
            <span className='truncate text-xs font-semibold text-slate-900'>{text}</span>
          </div>
        ),
      },
      {
        title: 'MSSV',
        dataIndex: 'studentId',
        key: 'studentId',
        width: 100,
        className: 'text-slate-500 font-mono text-[10px]',
      },
      {
        title: 'EMAIL',
        dataIndex: 'email',
        key: 'email',
        width: 180,
        className: 'text-slate-600 text-xs truncate',
      },
      {
        title: 'MAJOR',
        dataIndex: 'major',
        key: 'major',
        width: 140,
        render: (major) => {
          const colors = {
            'Computer Science': 'blue',
            'Software Engineering': 'cyan',
            'Data Science': 'purple',
            'UX Design': 'magenta',
          };
          const color = colors[major] || 'default';
          return (
            <Tag color={color} style={{ fontSize: '10px', fontWeight: 'bold' }}>
              {major.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        align: 'center',
        render: (status) => {
          const config = STATUS_CONFIG[status];
          return (
            <Tag
              color={config.color}
              bordered={false}
              style={{ fontWeight: 'bold', fontSize: '10px' }}
            >
              {config.label.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: 'MENTOR',
        dataIndex: 'mentorId',
        key: 'mentor',
        width: 160,
        render: (id) => {
          const mentor = MOCK_MENTORS.find((m) => m.id === id);
          return mentor ? (
            <span className='text-xs font-medium text-slate-600'>{mentor.name}</span>
          ) : (
            <span className='text-xs text-slate-400 italic'>Unassigned</span>
          );
        },
      },
      {
        title: 'ACTIONS',
        key: 'actions',
        width: 80,
        align: 'right',
        render: (_, record) => {
          const items = [];

          if (record.status === 'PENDING') {
            items.push(
              {
                key: 'accept',
                label: 'Accept Student',
                icon: <CheckOutlined className='text-emerald-500' />,
                onClick: () => onAccept(record),
              },
              {
                key: 'reject',
                label: 'Reject Student',
                icon: <CloseOutlined className='text-rose-500' />,
                onClick: () => onReject(record),
              },
            );
          }

          if (record.status === 'ACCEPTED') {
            items.push(
              {
                key: 'assign',
                label: 'Assign Mentor/Project',
                icon: <UserOutlined className='text-primary' />,
                onClick: () => onAssign(record),
              },
              {
                key: 'group',
                icon: <TeamOutlined />,
                label: record.groupId ? 'Change Group' : 'Add to Group',
                onClick: () => onGroup(record),
              },
            );
          }

          items.push(
            { type: 'divider' },
            {
              key: 'details',
              label: 'View Full Bio',
              icon: <EyeOutlined />,
            },
          );

          return (
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement='bottomRight'
              classNames={{ root: 'action-dropdown' }}
            >
              <Button
                type='text'
                className='hover:text-primary flex size-8 items-center justify-center rounded-lg p-0 text-slate-400 transition-all hover:bg-slate-100'
                icon={<MoreOutlined style={{ fontSize: '20px' }} />}
              />
            </Dropdown>
          );
        },
      },
    ],
    [onAccept, onReject, onAssign, onGroup],
  );

  return (
    <div className='flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ y: 'calc(100vh - 440px)' }}
        pagination={false}
        rowClassName='hover:bg-slate-50/50 transition-colors cursor-default'
        locale={{ emptyText: 'Chưa có sinh viên nào khớp với tìm kiếm' }}
        rowKey='id'
      />
    </div>
  );
};

export default InternshipTable;
