'use client';

import {
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
        width: 80,
        align: 'center',
        render: (_, __, index) => (
          <span className="text-muted font-mono text-xs font-bold">
            {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
          </span>
        ),
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
        key: 'termName',
        width: 140,
        render: (_, record) => (
          <div className="flex items-center gap-1.5">
            <span className="text-muted truncate text-[11px] font-medium tracking-wider uppercase opacity-60">
              {record.termName || TABLE.NOT_ASSIGNED}
            </span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.MENTOR,
        key: 'mentorName',
        width: 160,
        render: (_, record) => {
          const name = record.mentorName;
          return name && name !== '-' ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
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
        key: 'members',
        width: 120,
        align: 'center',
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <UserOutlined className="text-muted text-xs opacity-60" />
            <span className="text-muted text-xs font-bold">{record.memberCount ?? 0}</span>
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
            INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.FILTERS.STATUS_OPTIONS.find(
              (o) => o.value === status
            )?.label || '-';
          return (
            <Badge variant={variant} size="sm">
              {label}
            </Badge>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTION,
        key: 'actions',
        width: 60,
        align: 'center',
        render: (_, record) => {
          const isArchived = record.status === 3;
          const isActive = record.status === 1;

          const items = [
            {
              key: 'view',
              label: INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.VIEW,
              icon: <EyeOutlined className="text-primary" />,
              onClick: () => onView(record),
            },
            ...(isActive && isTermEditable
              ? [
                  {
                    key: 'edit',
                    label: INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.EDIT,
                    icon: <EditOutlined className="text-primary" />,
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
                    onClick: () => onAssign(record),
                  },
                  {
                    key: 'archive',
                    label: INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.ARCHIVE_TOOLTIP,
                    icon: <InboxOutlined className="text-warning" />,
                    onClick: () => onArchive(record),
                  },
                  { type: 'divider' },
                  {
                    key: 'delete',
                    label: INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.DELETE,
                    icon: <DeleteOutlined className="text-danger" />,
                    danger: true,
                    onClick: () => onDelete(record),
                  },
                ]
              : []),
          ];

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined />}
                  className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
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
