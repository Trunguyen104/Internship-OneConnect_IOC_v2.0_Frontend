'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InboxOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import StatusBadge from '@/components/ui/status-badge';
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
        render: (_, record) => {
          const name =
            record.phaseName || record.phase?.name || record.termName || TABLE.NOT_ASSIGNED;
          const start = record.startDate || record.phase?.startDate;
          const end = record.endDate || record.phase?.endDate;

          return (
            <div className="flex flex-col leading-tight grow overflow-hidden">
              <span
                className={`${TABLE_CELL.secondary} truncate text-xs font-bold mb-0.5`}
                title={name}
              >
                {name}
              </span>
              {(start || end) && (
                <div className="text-muted text-[10px] font-medium opacity-60 flex items-center gap-1">
                  <span className="truncate">{start ? dayjs(start).format('MMM DD') : '??'}</span>
                  <span>-</span>
                  <span className="truncate">{end ? dayjs(end).format('MMM DD, YYYY') : '??'}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.MENTOR,
        key: 'mentorName',
        width: 180,
        render: (_, record) => {
          const name = record.mentorName;
          const isActive = record.status === 1;
          const hasMentor = name && name !== '-';

          if (!hasMentor && isActive && isPhaseEditable) {
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign({ open: true, group: record });
                }}
                className="flex items-center gap-1 text-primary hover:text-primary-hover font-extrabold text-[10px] uppercase tracking-wider transition-all hover:scale-105"
              >
                <UserOutlined className="text-xs" />
                {INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.CARD.ASSIGN_MENTOR}
              </button>
            );
          }

          return hasMentor ? (
            <div className="flex flex-col group/mentor cursor-default">
              <span
                className={`${TABLE_CELL.primary} truncate text-xs font-extrabold text-slate-700`}
              >
                {name}
              </span>
              {record.mentorEmail && (
                <span className="text-[9px] text-slate-400 font-bold truncate opacity-0 group-hover/mentor:opacity-100 transition-opacity">
                  {record.mentorEmail}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted text-[10px] font-bold tracking-wider uppercase italic opacity-30">
              {TABLE.NOT_ASSIGNED}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.PROJECT,
        dataIndex: 'projectName',
        key: 'projectName',
        width: 220,
        render: (text, record) => (
          <div className="flex items-center gap-2 max-w-[200px]">
            <ProjectOutlined className="text-primary/40 shrink-0" />
            <span
              className={`${TABLE_CELL.secondary} truncate text-xs font-bold text-slate-600`}
              title={text}
            >
              {text || 'N/A'}
            </span>
            {record.projectCount > 1 && (
              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full border border-primary/20 whitespace-nowrap shrink-0">
                +{record.projectCount - 1} {GROUP_MANAGEMENT.TABLE.MORE}
              </span>
            )}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.MEMBERS,
        key: 'members',
        width: 100,
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
          const variant = GROUP_STATUS_VARIANTS[status] || 'neutral';
          const label =
            INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.STATUS.LABELS[status] || status || '-';

          return <StatusBadge variant={variant} label={label} />;
        },
      },
      {
        title: TABLE.COLUMNS.ACTION,
        key: 'actions',
        width: 60,
        align: 'center',
        render: (_, record) => {
          const isActive = record.status === 1;
          const { ACTIONS } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT;
          const hasMentor = record.mentorName && record.mentorName !== '-';

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
                    key: 'assign-mentor',
                    label: hasMentor ? 'Change Mentor' : 'Assign Mentor',
                    icon: <UserOutlined />,
                    onClick: () => onAssign({ open: true, group: record }),
                  },
                  { type: 'divider' },
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
