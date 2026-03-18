'use client';

import React, { memo, useMemo } from 'react';
import { Tooltip, Button } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import DataTable from '@/components/ui/DataTable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { MOCK_MENTORS } from '../constants/internshipData';

const STATUS_CONFIG = {
  ACCEPTED: {
    bgClass: '!bg-success-surface',
    textClass: '!text-success',
  },
  PENDING: {
    bgClass: '!bg-info-surface',
    textClass: '!text-info',
  },
  REJECTED: {
    bgClass: '!bg-danger-surface',
    textClass: '!text-danger',
  },
  REVOKED: {
    bgClass: '!bg-gray-100',
    textClass: '!text-gray-500',
  },
  default: {
    bgClass: '!bg-gray-100',
    textClass: '!text-gray-500',
  },
};

const InternshipTable = memo(function InternshipTable({
  data,
  loading,
  page,
  pageSize,
  onAccept,
  onReject,
  onAssign,
  onGroup,
}) {
  const { TABLE, ACTIONS, STATUS_LABELS } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: '60px',
        align: 'center',
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
        className: 'text-muted font-semibold text-xs',
      },
      {
        title: TABLE.COLUMNS.FULL_NAME,
        dataIndex: 'fullName',
        key: 'fullName',
        width: 250,
        render: (text, record) => {
          const initials = (text || '')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          return (
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold shadow-sm'>
                {initials}
              </div>
              <div className='flex flex-col'>
                <span className='text-text truncate text-sm font-bold'>{text || 'N/A'}</span>
                <span className='text-muted text-[10px] font-medium tracking-wider uppercase opacity-60'>
                  {record.major || 'None'}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.STUDENT_ID,
        dataIndex: 'studentId',
        key: 'studentId',
        width: 120,
        render: (id) => (
          <span className='text-muted font-mono text-xs font-semibold uppercase'>{id}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.EMAIL,
        dataIndex: 'email',
        key: 'email',
        width: 200,
        render: (email) => (
          <span className='text-text block truncate text-xs opacity-70'>{email}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: 160,
        align: 'center',
        render: (status) => {
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
          const label = (STATUS_LABELS && STATUS_LABELS[status]) || status;
          return (
            <span
              className={`${config.bgClass} ${config.textClass} m-0 inline-flex h-6 w-fit items-center justify-center rounded-full px-2.5 text-[10px] font-bold uppercase transition-all`}
            >
              {label}
            </span>
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
              <div className='bg-primary-hover h-1.5 w-1.5 rounded-full' />
              <span className='text-text text-xs font-bold'>{mentor.name}</span>
            </div>
          ) : (
            <span className='text-muted text-[10px] font-medium tracking-wider uppercase italic opacity-40'>
              {TABLE.NOT_ASSIGNED}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTION,
        key: 'actions',
        width: 150,
        align: 'right',
        render: (_, record) => (
          <div className='flex items-center justify-end gap-1'>
            {record.status === 'PENDING' && (
              <>
                <Tooltip title={ACTIONS.ACCEPT}>
                  <Button
                    type='text'
                    size='small'
                    icon={<CheckOutlined />}
                    className='hover:bg-success/10 hover:text-success text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                    onClick={(e) => {
                      e.stopPropagation();
                      onAccept(record);
                    }}
                  />
                </Tooltip>
                <Tooltip title={ACTIONS.REJECT}>
                  <Button
                    type='text'
                    size='small'
                    danger
                    icon={<CloseOutlined />}
                    className='hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(record);
                    }}
                  />
                </Tooltip>
              </>
            )}
            <Tooltip title={ACTIONS.ASSIGN || 'Assign Mentor'}>
              <Button
                type='text'
                size='small'
                icon={<UserOutlined />}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign(record);
                }}
              />
            </Tooltip>
            <Tooltip title={ACTIONS.GROUP_ACTION || ACTIONS.GROUP || 'Group Management'}>
              <Button
                type='text'
                size='small'
                icon={<TeamOutlined />}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onGroup(record);
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [page, pageSize, onAccept, onReject, onAssign, onGroup, TABLE, ACTIONS, STATUS_LABELS],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey='id'
      minWidth='1000px'
      className='no-scrollbar mt-2 min-h-0 flex-1'
    />
  );
});

export default InternshipTable;
