'use client';

import {
  CheckCircleFilled,
  CloseCircleFilled,
  EyeOutlined,
  MinusCircleFilled,
  MoreOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';

import { ENTERPRISE_STUDENT_UI } from '../constants/enterprise-student.constants';

const STATUS_CONFIG = {
  Pending: {
    icon: <MinusCircleFilled className="text-warning" />,
    bgClass: 'bg-warning-surface',
    textClass: 'text-warning',
  },
  Approved: {
    icon: <CheckCircleFilled className="text-success" />,
    bgClass: 'bg-success-surface',
    textClass: 'text-success',
  },
  Rejected: {
    icon: <CloseCircleFilled className="text-danger" />,
    bgClass: 'bg-danger-surface',
    textClass: 'text-danger',
  },
  default: {
    icon: <MinusCircleFilled className="text-muted" />,
    bgClass: 'bg-muted/10',
    textClass: 'text-muted',
  },
};

const StudentTable = memo(function StudentTable({
  data,
  loading,
  page = 1,
  pageSize = 10,
  onView,
  onAccept,
  onReject,
  onAssign,
  onCreateGroup,
  onChangeGroup,
  sortBy,
  sortOrder,
  onSort,
  selectedRowKeys = [],
  onSelectRowChange,
}) {
  const { TABLE, ACTIONS, BADGES, STATUS } = ENTERPRISE_STUDENT_UI;

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
        key: 'studentFullName',
        sortKey: 'studentFullName',
        width: '180px',
        render: (_, record) => (
          <div className="flex flex-col">
            <span className="text-text text-sm font-semibold">{record.studentFullName}</span>
            <span className="text-muted text-[11px] font-medium uppercase opacity-60">
              {record.universityName || '-'}
            </span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STUDENT_ID,
        key: 'studentCode',
        sortKey: 'studentCode',
        width: '100px',
        render: (_, record) => (
          <span className="text-muted font-mono text-xs font-semibold">{record.studentCode}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.EMAIL,
        key: 'studentEmail',
        width: '180px',
        render: (_, record) => (
          <span className="text-muted text-xs truncate max-w-[170px] inline-block">
            {record.studentEmail || '-'}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        sortKey: 'status',
        width: '100px',
        align: 'center',
        render: (statusIdx) => {
          // Status enum: 0 Pending, 1 Approved, 2 Rejected
          let statusText = 'Pending';
          if (statusIdx === 1) statusText = 'Approved';
          if (statusIdx === 2) statusText = 'Rejected';

          const config = STATUS_CONFIG[statusText] || STATUS_CONFIG.default;
          // Map to UI Label
          const uiLabel =
            statusText === 'Approved'
              ? STATUS.ACCEPTED
              : statusText === 'Rejected'
                ? STATUS.REJECTED
                : STATUS.PENDING;

          return (
            <span
              className={`${config.bgClass} ${config.textClass} inline-flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold uppercase transition-all`}
            >
              {uiLabel}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.GROUP,
        key: 'group',
        width: '140px',
        render: (_, record) => {
          // If approved but no group
          if (record.status === 1 && !record.groupId) {
            return (
              <span
                className="bg-warning-surface text-warning hover:bg-warning/20 cursor-pointer inline-flex h-5 items-center rounded px-2 text-[11px] font-medium transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateGroup(record);
                }}
              >
                {BADGES.NO_GROUP}
              </span>
            );
          }
          if (record.groupName) {
            return (
              <span
                className="text-primary hover:text-primary-focus cursor-pointer text-xs font-medium underline-offset-2 hover:underline transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeGroup(record);
                }}
              >
                {record.groupName}
              </span>
            );
          }
          return <span className="text-muted text-xs">-</span>;
        },
      },
      {
        title: TABLE.COLUMNS.MENTOR,
        key: 'mentor',
        width: '140px',
        render: (_, record) => (
          <span className="text-text text-xs">{record.mentorName || '-'}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: '80px',
        align: 'center',
        render: (_, record) => {
          const isPending = record.status === 0;
          const isApproved = record.status === 1;

          const menuItems = [
            {
              key: 'view',
              label: ACTIONS.VIEW_DETAIL,
              icon: <EyeOutlined />,
              onClick: () => onView(record),
            },
          ];

          if (isApproved) {
            menuItems.push({
              key: 'assign',
              label: ACTIONS.ASSIGN,
              icon: <UserAddOutlined />,
              onClick: () => onAssign(record),
            });
            menuItems.push({
              key: 'changeGroup',
              label: ACTIONS.CHANGE_GROUP,
              icon: <UsergroupAddOutlined />,
              onClick: () => onChangeGroup(record),
            });
          }

          if (isPending) {
            menuItems.push({
              key: 'accept',
              label: ACTIONS.ACCEPT,
              icon: <CheckCircleFilled className="text-success" />,
              onClick: () => onAccept(record),
            });
            menuItems.push({
              key: 'reject',
              label: ACTIONS.REJECT,
              icon: <CloseCircleFilled className="text-danger" />,
              onClick: () => onReject(record),
            });
          }

          return (
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <Button
                type="text"
                icon={
                  <MoreOutlined className="text-muted hover:text-primary transition-colors text-lg" />
                }
                className="flex items-center justify-center opacity-70 hover:opacity-100"
              />
            </Dropdown>
          );
        },
      },
    ],
    [
      page,
      pageSize,
      onView,
      onAccept,
      onReject,
      onAssign,
      onCreateGroup,
      onChangeGroup,
      ACTIONS,
      BADGES,
      STATUS,
      TABLE.COLUMNS,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      rowSelection={rowSelection}
      pagination={false}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      minWidth="800px"
      tableLayout="fixed"
      className="no-scrollbar mt-2 min-h-0 flex-1"
    />
  );
});

export default StudentTable;
