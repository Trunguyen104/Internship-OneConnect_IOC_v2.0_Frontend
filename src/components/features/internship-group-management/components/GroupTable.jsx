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
import { Avatar, Button, Dropdown } from 'antd';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';

import { ENTERPRISE_GROUP_UI, GROUP_STATUS_MAP } from '../constants/enterprise-group.constants';

const STATUS_CONFIG = {
  InProgress: {
    bgClass: '!bg-success-surface',
    textClass: '!text-success',
  },
  FINISHED: {
    bgClass: '!bg-info-surface',
    textClass: '!text-info',
  },
  ARCHIVED: {
    bgClass: '!bg-gray-100',
    textClass: '!text-muted',
  },
  default: {
    bgClass: '!bg-gray-100',
    textClass: '!text-muted',
  },
};

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
}) {
  const { TABLE, CARD } = ENTERPRISE_GROUP_UI;

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
        render: (text, record) => (
          <div className="flex flex-col overflow-hidden">
            <span className="text-text truncate text-sm font-bold capitalize">
              {text || TABLE.NOT_ASSIGNED}
            </span>
            <span className="text-muted truncate text-[11px] font-medium tracking-wider uppercase opacity-60">
              {record.track || TABLE.NOT_ASSIGNED}
            </span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.TERM,
        dataIndex: 'term',
        key: 'term',
        width: 100,
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
        dataIndex: 'mentorId',
        key: 'mentor',
        width: 140,
        render: (_, record) => {
          return record.mentorName ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="bg-primary-hover h-1.5 w-1.5 shrink-0 rounded-full" />
              <span className="text-text truncate text-xs leading-none font-bold">
                {record.mentorName}
              </span>
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
        width: 90,
        align: 'center',
        render: (count, record) => (
          <div className="flex items-center justify-center gap-1.5">
            <Avatar.Group max={{ count: 2 }} size="small">
              {(record.avatars || []).map((url, i) => (
                <Avatar key={i} src={url} className="border-surface border-2 shadow-sm" />
              ))}
              {(!record.avatars || record.avatars.length === 0) && count > 0 && (
                <Avatar icon={<UserOutlined />} className="bg-muted/10 text-muted" />
              )}
            </Avatar.Group>
            <span className="text-muted text-xs font-bold">{count}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: 90,
        align: 'center',
        render: (statusValue) => {
          const statusStr = GROUP_STATUS_MAP[statusValue] || 'InProgress';
          const uiLabel =
            ENTERPRISE_GROUP_UI.STATUS[
              statusStr === 'InProgress' ? 'IN_PROGRESS' : statusStr.toUpperCase()
            ];
          const config = STATUS_CONFIG[statusStr] || STATUS_CONFIG.default;
          return (
            <span
              className={`${config.bgClass} ${config.textClass} m-0 inline-flex h-6 w-fit items-center justify-center rounded-full px-2.5 text-[10px] font-bold uppercase transition-all`}
            >
              {uiLabel}
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
                    label: CARD.ARCHIVE_TOOLTIP,
                    icon: <InboxOutlined className="text-warning" />,
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
    [page, pageSize, onAssign, onDelete, onArchive, onView, onEdit, TABLE, CARD]
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
