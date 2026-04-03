'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InboxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, { memo, useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import TableRowDropdown from '@/components/ui/TableRowActions';
import {
  GROUP_STATUS_VARIANTS,
  INTERNSHIP_MANAGEMENT_UI,
} from '@/constants/internship-management/internship-management';
import { TABLE_CELL } from '@/lib/tableStyles';

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
  isPhaseEditable,
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
          <span className={`${TABLE_CELL.mono} font-bold`}>
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
          <span className={`${TABLE_CELL.primary} block truncate capitalize`}>
            {text || TABLE.NOT_ASSIGNED}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.PHASE,
        key: 'phaseInfo',
        width: 200,
        render: (_, record) => (
          <div className="flex items-center gap-1.5">
            <span className={`${TABLE_CELL.meta} truncate font-bold`}>
              {record.phaseName || record.phase?.name || record.termName || TABLE.NOT_ASSIGNED}
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
              <span className={`${TABLE_CELL.primary} truncate text-xs font-bold`}>{name}</span>
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
            INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.STATUS.LABELS[status] || status || '-';

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
          const { ACTIONS } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT;

          const items = [
            {
              key: 'view',
              label: ACTIONS.VIEW_DETAIL,
              icon: <EyeOutlined />,
              onClick: () => onView(record),
            },
            ...(isActive && isPhaseEditable
              ? [
                  {
                    key: 'edit',
                    label: ACTIONS.EDIT_GROUP,
                    icon: <EditOutlined />,
                    onClick: () => onEdit(record),
                  },
                  {
                    key: 'archive',
                    label: ACTIONS.ARCHIVE_GROUP,
                    icon: <InboxOutlined />,
                    variant: 'warning',
                    onClick: () => onArchive(record),
                  },
                  { type: 'divider' },
                  {
                    key: 'delete',
                    label: ACTIONS.DELETE_GROUP,
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => onDelete(record),
                  },
                ].filter(Boolean)
              : []),
          ];

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <TableRowDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [page, pageSize, onAssign, onDelete, onArchive, onView, onEdit, isPhaseEditable, TABLE, CARD]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      minWidth="780px"
      tableLayout="fixed"
      size="small"
      className="no-scrollbar mt-2 min-h-0 flex-1"
    />
  );
});

export default GroupTable;
