'use client';

import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { MOCK_GROUPS, MOCK_MENTORS } from '../constants/internshipData';
import StatusTag from './StatusTag';

const InternshipTable = memo(function InternshipTable({
  data,
  loading,
  page,
  pageSize,
  onAccept,
  onReject,
  onAssign,
  onGroup,
  onView,
  selectedRowKeys = [],
  onSelectRowChange,
}) {
  const { TABLE, ACTIONS, STATUS_LABELS } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectRowChange,
  };

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
        width: 160,
        render: (text, record) => {
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col overflow-hidden">
                <span className="text-text truncate text-sm font-bold">{text || 'N/A'}</span>
                <span className="text-muted truncate text-[11px] font-medium tracking-wider uppercase opacity-60">
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
        width: 70,
        render: (id) => (
          <span className="text-muted font-mono text-xs font-semibold uppercase">{id}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: 90,
        align: 'center',
        render: (status) => <StatusTag status={status} />,
      },
      {
        title: TABLE.COLUMNS.GROUP,
        dataIndex: 'groupId',
        key: 'group',
        width: 120,
        render: (id) => {
          const group = MOCK_GROUPS.find((g) => g.id === id);
          return group ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <TeamOutlined className="text-primary text-xs opacity-60" />
              <span className="text-text truncate text-xs font-bold">{group.name}</span>
            </div>
          ) : (
            <span className="text-muted text-[10px] font-medium tracking-wider uppercase italic opacity-40">
              {TABLE.NOT_ASSIGNED}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.MENTOR,
        dataIndex: 'mentorId',
        key: 'mentor',
        width: 120,
        render: (id) => {
          const mentor = MOCK_MENTORS.find((m) => m.id === id);
          return mentor ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="bg-primary-hover h-1.5 w-1.5 shrink-0 rounded-full" />
              <span className="text-text truncate text-xs font-bold">{mentor.name}</span>
            </div>
          ) : (
            <span className="text-muted text-[10px] font-medium tracking-wider uppercase italic opacity-40">
              {TABLE.NOT_ASSIGNED}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTION,
        key: 'actions',
        width: 40,
        align: 'center',
        render: (_, record) => {
          const items = [
            {
              key: 'view',
              label: ACTIONS.VIEW_BIO,
              icon: <EyeOutlined className="text-primary" />,
              onClick: () => onView(record),
            },
            { type: 'divider' },
            ...(record.status === 'PENDING'
              ? [
                  {
                    key: 'accept',
                    label: ACTIONS.ACCEPT,
                    icon: <CheckOutlined className="text-success" />,
                    onClick: () => onAccept(record),
                  },
                  {
                    key: 'reject',
                    label: ACTIONS.REJECT,
                    icon: <CloseOutlined className="text-danger" />,
                    onClick: () => onReject(record),
                  },
                  { type: 'divider' },
                ]
              : []),
            {
              key: 'assign',
              label: ACTIONS.ASSIGN,
              icon: <UserOutlined className="text-primary" />,
              onClick: () => onAssign(record),
            },
            {
              key: 'group',
              label: ACTIONS.ADD_TO_GROUP,
              icon: <TeamOutlined className="text-primary" />,
              onClick: () => onGroup(record),
            },
          ];

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined />}
                  className="hover:bg-primary/10 text-muted flex h-8 w-8 items-center justify-center rounded-lg"
                />
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [page, pageSize, onAccept, onReject, onAssign, onGroup, onView, TABLE, ACTIONS, STATUS_LABELS]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      rowSelection={rowSelection}
      minWidth="780px"
      tableLayout="fixed"
      className="no-scrollbar mt-2 min-h-0 flex-1"
      onRowClick={onView}
    />
  );
});

export default InternshipTable;
