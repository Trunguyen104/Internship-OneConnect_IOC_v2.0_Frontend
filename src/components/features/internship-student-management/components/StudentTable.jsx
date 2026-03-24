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
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import {
  INTERNSHIP_MANAGEMENT_UI,
  TERM_STATUS_VARIANTS,
} from '@/constants/internship-management/internship-management';

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
  onAddToGroup,
  onChangeGroup,
  isTermEditable,
  hasGroups,
  sortBy,
  sortOrder,
  onSort,
  emptyText,
}) {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const { TABLE, ACTIONS, STATUS_LABELS } = INTERNSHIP_LIST;

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 80,
        align: 'center',
        render: (_, __, index) => (
          <span className="text-muted font-mono text-xs font-bold">
            {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
          </span>
        ),
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
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        sortKey: 'status',
        width: '100px',
        align: 'center',
        render: (statusIdx) => {
          const config =
            statusIdx === 2
              ? STATUS_CONFIG.Approved
              : statusIdx === 3
                ? STATUS_CONFIG.Rejected
                : STATUS_CONFIG.Pending;

          const uiLabel =
            statusIdx === 2
              ? STATUS_LABELS.ACCEPTED
              : statusIdx === 3
                ? STATUS_LABELS.REJECTED
                : STATUS_LABELS.PENDING;

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
        title: TABLE.COLUMNS.TERM_STATUS,
        key: 'termStatus',
        width: '110px',
        align: 'center',
        render: (_, record) => {
          const status = record.termStatus;
          const variant = TERM_STATUS_VARIANTS[status] || 'default';
          const label =
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[status] || '-';
          return (
            <Badge variant={variant} size="sm">
              {label}
            </Badge>
          );
        },
      },
      {
        title: TABLE.COLUMNS.INTERNSHIP_PERIOD,
        key: 'period',
        width: '160px',
        align: 'center',
        render: (_, record) => {
          if (!record.startDate || !record.endDate)
            return <span className="text-muted text-xs">-</span>;
          return (
            <div className="text-muted flex flex-col text-[10px] font-medium uppercase leading-tight">
              <span>{dayjs(record.startDate).format('DD/MM/YYYY')}</span>
              <span className="opacity-40">
                {INTERNSHIP_MANAGEMENT_UI.ENTERPRISE.VIOLATION_REPORT.COMMON.DASH_SEPARATOR}
              </span>
              <span>{dayjs(record.endDate).format('DD/MM/YYYY')}</span>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.GROUP,
        key: 'group',
        width: '150px',
        render: (_, record) => {
          const isPlaced = record.status === 2;

          if (isPlaced && !record.groupId) {
            return (
              <span
                className={`${record.termStatus !== 2 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-warning/20'} bg-warning-surface text-warning inline-flex h-5 items-center rounded px-2 text-[11px] font-medium transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (record.termStatus === 2) onCreateGroup(record);
                }}
              >
                {INTERNSHIP_LIST.BADGES.NO_GROUP}
              </span>
            );
          }
          if (record.groupName) {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'change',
                      label: ACTIONS.CHANGE_GROUP,
                      icon: <UsergroupAddOutlined />,
                      disabled: !isTermEditable,
                      onClick: () => onChangeGroup(record),
                    },
                  ],
                }}
                trigger={record.termStatus === 2 ? ['click'] : []}
              >
                <span
                  className={`${record.termStatus === 2 ? 'text-primary cursor-pointer underline-offset-2 hover:underline' : 'text-muted cursor-default'} text-xs font-medium transition-all`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {record.groupName}
                </span>
              </Dropdown>
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
        title: TABLE.COLUMNS.ACTION,
        key: 'actions',
        width: '80px',
        align: 'center',
        render: (_, record) => {
          const isPending = record.status === 1;
          const isApproved = record.status === 2;

          const menuItems = [
            {
              key: 'view',
              label: INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.VIEW,
              icon: <EyeOutlined />,
              onClick: () => onView(record),
            },
          ];

          const isEditable = record.termStatus === 2;

          if (isApproved && isEditable) {
            menuItems.push({
              key: 'assign',
              label: ACTIONS.ASSIGN,
              icon: <UserAddOutlined />,
              onClick: () => onAssign(record),
            });
          }

          if (isPending && isEditable) {
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
                size="small"
                icon={<MoreOutlined />}
                className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
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
      isTermEditable,
      ACTIONS,
      STATUS_LABELS,
      TABLE.COLUMNS,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      pagination={false}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      minWidth="800px"
      tableLayout="fixed"
      emptyText={emptyText}
      className="no-scrollbar mt-2 min-h-0 flex-1"
    />
  );
});

export default StudentTable;
