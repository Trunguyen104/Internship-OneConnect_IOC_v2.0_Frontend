'use client';

import {
  CheckCircleFilled,
  CloseCircleFilled,
  EyeOutlined,
  MinusCircleFilled,
  MoreOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

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
  onAssign,
  onCreateGroup,
  onAddToGroup,
  onChangeGroup,
  isPhaseEditable,
  hasGroups,
  sortBy,
  sortOrder,
  onSort,
  selectedRowKeys,
  onSelectRowChange,
  emptyText,
}) {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const { TABLE, ACTIONS, STATUS_LABELS } = INTERNSHIP_LIST;

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 60,
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
        sortKey: 'FullName',
        sorter: true,
        width: '170px',
        render: (_, record) => (
          <div className="flex flex-col">
            <span className="text-text text-sm font-semibold">{record.studentFullName}</span>
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
        width: '140px', // Adjusted width
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
      // {
      //   title: TABLE.COLUMNS.PHASE_STATUS,
      //   key: 'phaseStatus',
      //   width: '140px', // Adjusted width
      //   align: 'center',
      //   render: (_, record) => {
      //     const status = record.phaseStatus !== undefined ? record.phaseStatus : record.termStatus;
      //     const variant =
      //       INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_VARIANTS[status] || 'default';
      //     const label =
      //       INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[status] || '-';
      //     return (
      //       <Badge variant={variant || 'default'} size="sm">
      //         {label}
      //       </Badge>
      //     );
      //   },
      // },
      {
        title: TABLE.COLUMNS.INTERNSHIP_PERIOD,
        key: 'period',
        width: '220px', // Adjusted width
        align: 'center',
        render: (_, record) => {
          if (!record.startDate || !record.endDate)
            return <span className="text-muted text-xs">-</span>;
          return (
            <div className="text-muted flex items-center justify-center gap-1.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-tight">
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
        sortKey: 'GroupName',
        sorter: true,
        width: '150px',
        render: (_, record) => {
          const isPlaced = record.status === 2;
          const isEditable =
            [1, 2].includes(record.phaseStatus) || [1, 2].includes(record.termStatus);

          if (isPlaced && !record.groupId) {
            return (
              <span
                className={`${isEditable ? 'cursor-pointer hover:bg-warning/20' : 'opacity-50'} bg-warning-surface text-warning inline-flex h-5 items-center rounded px-2 text-[11px] font-medium transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditable) {
                    if (hasGroups) onAddToGroup(record);
                    else onCreateGroup(record);
                  }
                }}
              >
                {INTERNSHIP_LIST.BADGES.NO_GROUP}
              </span>
            );
          }
          if (record.groupName) {
            return (
              <span
                className={`${isEditable ? 'text-primary cursor-pointer underline hover:text-primary-hover' : 'text-muted cursor-default'} block truncate max-w-[140px] text-xs font-medium transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditable) onChangeGroup(record);
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

          const isEditable =
            [1, 2].includes(record.phaseStatus) || [1, 2].includes(record.termStatus);

          if (isApproved && isEditable) {
            if (!record.groupId) {
              menuItems.push({
                key: 'createGroup',
                label: ACTIONS.CREATE_GROUP,
                icon: <UsergroupAddOutlined />,
                onClick: () => onCreateGroup(record),
              });

              if (hasGroups) {
                menuItems.push({
                  key: 'addToGroup',
                  label: ACTIONS.ADD_TO_GROUP,
                  icon: <UsergroupAddOutlined />,
                  onClick: () => onAddToGroup(record),
                });
              }
            } else {
              menuItems.push({
                key: 'changeGroup',
                label: ACTIONS.CHANGE_GROUP,
                icon: <UsergroupAddOutlined />,
                onClick: () => onChangeGroup(record),
              });
            }
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
      onCreateGroup,
      onAddToGroup,
      onChangeGroup,
      isPhaseEditable,
      hasGroups,
      ACTIONS,
      STATUS_LABELS,
      TABLE,
      INTERNSHIP_LIST,
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
      selection={{
        selectedRowKeys,
        onChange: onSelectRowChange,
      }}
      minWidth="800px"
      size="small"
      tableLayout="fixed"
      emptyText={emptyText}
      className="no-scrollbar mt-2 min-h-0 flex-1"
    />
  );
});

export default StudentTable;
