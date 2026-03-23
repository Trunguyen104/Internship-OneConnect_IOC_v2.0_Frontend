'use client';

import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InboxOutlined,
  MoreOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { memo, useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import {
  GROUP_STATUS_VARIANTS,
  INTERNSHIP_MANAGEMENT_UI,
} from '@/constants/internship-management/internship-management';

const GroupTable = memo(function GroupTable({
  data,
  loading,
  page,
  pageSize,
  onAssign,
  onDelete,
  onArchive,
  onView,
  onEdit,
  isTermEditable,
}) {
  const { TABLE, CARD } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT;

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 40,
        align: 'center',
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
        className: 'text-muted font-semibold text-xs',
      },
      {
        title: TABLE.COLUMNS.GROUP_NAME,
        dataIndex: 'name',
        key: 'name',
        width: 180,
        render: (text) => (
          <span className="text-text truncate text-sm font-bold capitalize">
            {text || TABLE.NOT_ASSIGNED}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.TERM,
        dataIndex: 'term',
        key: 'term',
        width: 140,
        render: (text) => (
          <div className="flex items-center gap-1.5">
            <CalendarOutlined className="text-muted text-xs opacity-60" />
            <span className="text-muted truncate text-[11px] font-medium tracking-wider uppercase opacity-60">
              {text || TABLE.NOT_ASSIGNED}
            </span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.MENTOR,
        dataIndex: 'mentorName',
        key: 'mentor',
        width: 160,
        render: (name) => {
          return name ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
              <span className="text-text truncate text-xs font-bold">{name}</span>
            </div>
          ) : (
            <span className="text-muted text-[10px] font-medium tracking-wider uppercase italic opacity-40">
              {TABLE.NOT_ASSIGNED}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.MEMBERS,
        dataIndex: 'memberCount',
        key: 'members',
        width: 120,
        align: 'center',
        render: (count) => (
          <div className="flex items-center justify-center gap-2">
            <UserOutlined className="text-muted text-xs opacity-60" />
            <span className="text-muted text-xs font-bold">{count}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: 110,
        align: 'center',
        render: (status) => {
          const variant = GROUP_STATUS_VARIANTS[status] || 'default';
          const label =
            INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.STATUS_OPTIONS.find((o) => o.value === status)
              ?.label || '-';
          return (
            <Badge variant={variant} size="sm">
              {label}
            </Badge>
          );
        },
      },
      {
        title: INTERNSHIP_MANAGEMENT_UI.ENTERPRISE.VIOLATION_REPORT.TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 60,
        align: 'center',
        render: (_, record) => {
          // 2 = Archived
          const isArchived = record.status === 2;
          const items = [
            {
              key: 'view',
              label: CARD.VIEW_DETAILS,
              icon: <EyeOutlined className="text-primary" />,
              onClick: () => onView(record),
            },
            ...(!isArchived
              ? [
                  {
                    key: 'edit',
                    label: CARD.EDIT_GROUP || 'Edit Group',
                    icon: <EditOutlined className="text-primary" />,
                    disabled: !isTermEditable,
                    onClick: () => onEdit(record),
                  },
                  {
                    key: 'assign',
                    label: record.mentorId ? CARD.CHANGE_MENTOR : CARD.ASSIGN_MENTOR,
                    icon: record.mentorId ? (
                      <UserOutlined className="text-primary" />
                    ) : (
                      <UserAddOutlined className="text-primary" />
                    ),
                    disabled: !isTermEditable,
                    onClick: () => onAssign(record),
                  },
                  {
                    key: 'archive',
                    label: CARD.ARCHIVE_TOOLTIP,
                    icon: <InboxOutlined className="text-warning" />,
                    disabled: !isTermEditable || record.termStatus !== 2,
                    onClick: () => onArchive(record),
                  },
                ]
              : []),
            { type: 'divider' },
            {
              key: 'delete',
              label: CARD.DELETE_TOOLTIP,
              icon: <DeleteOutlined className="text-danger" />,
              danger: true,
              onClick: () => onDelete(record),
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
    [page, pageSize, onAssign, onDelete, onArchive, onView, onEdit, isTermEditable, TABLE, CARD]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      minWidth="780px"
      tableLayout="fixed"
      className="no-scrollbar mt-2 min-h-0 flex-1"
    />
  );
});

export default GroupTable;
