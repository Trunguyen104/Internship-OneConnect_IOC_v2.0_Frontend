'use client';

import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InboxOutlined,
  RollbackOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import StatusBadge from '@/components/ui/status-badge';
import TableRowDropdown, { TableRowIconButton } from '@/components/ui/TableRowActions';
import {
  getOperationalStatus,
  getVisibilityStatus,
  OPERATIONAL_LABELS,
  OPERATIONAL_STATUS,
  PROJECT_MANAGEMENT,
  STATUS_VARIANTS,
  VISIBILITY_LABELS,
  VISIBILITY_STATUS,
} from '@/constants/project-management/project-management';
import { cn } from '@/lib/cn';

export default function ProjectTable({
  data,
  loading,
  pagination,
  groups = [],
  isMentor = true, // Default to true for backward compatibility
  onEdit,
  onView,
  onAssign,
  onComplete,
  onDelete,
  onArchive,
  onUnpublish,
}) {
  const { TABLE } = PROJECT_MANAGEMENT;
  const current = pagination?.current ?? 1;
  const pageSize = pagination?.pageSize ?? 10;

  const columns = useMemo(
    () => [
      {
        title: TABLE.COLUMNS.INDEX,
        key: 'index',
        width: 40,
        render: (_, record, index) => (current - 1) * pageSize + index + 1,
      },
      {
        title: TABLE.COLUMNS.NAME,
        key: 'name',
        width: 160,
        render: (text, record) => (
          <div
            className="font-semibold text-slate-900 hover:text-primary hover:underline cursor-pointer truncate max-w-[160px] transition-colors"
            title={record.projectName}
            onClick={() => onView(record)}
          >
            {record.projectName}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.CODE,
        key: 'code',
        width: 110,
        render: (_, record) => (
          <div
            className="w-[100px] truncate text-slate-500"
            title={record.projectCode || record.code}
          >
            {record.projectCode || record.code}
          </div>
        ),
      },
      {
        title: PROJECT_MANAGEMENT.FILTERS.GROUP_FILTER,
        key: 'group',
        width: 160,
        render: (_, record) => {
          const gid = record.internshipId || record.internshipGroupId || record.groupId;
          let groupName =
            record.groupName || record.groupInfo?.groupName || record.internshipGroup?.groupName;

          if (!groupName && gid && Array.isArray(groups)) {
            const group = groups.find(
              (g) =>
                (g.internshipId && g.internshipId.toLowerCase() === gid.toLowerCase()) ||
                (g.id && g.id.toLowerCase() === gid.toLowerCase())
            );
            if (group) groupName = group.groupName;
          }

          const isEmptyGuid = gid === '00000000-0000-0000-0000-000000000000';
          const isMissing = !gid || isEmptyGuid || gid === '';

          let content = null;
          if (isMissing) {
            content = (
              <span className="text-slate-400 italic text-xs">{TABLE.STATUS_TEXT.NO_GROUP}</span>
            );
          } else {
            content = (
              <div className="flex flex-col gap-1 items-start max-w-[150px]">
                <div className="truncate w-full font-medium" title={groupName}>
                  {groupName}
                </div>
                {record.isGroupArchived && (
                  <Badge
                    variant="default"
                    size="xs"
                    className="border-slate-200 bg-slate-100 px-1.5 py-0 text-[9px] text-slate-500"
                  >
                    {TABLE.STATUS_TEXT.GROUP_ARCHIVED}
                  </Badge>
                )}
              </div>
            );
          }

          const op = getOperationalStatus(record.operationalStatus ?? record.status);
          const isReadOnly =
            op === OPERATIONAL_STATUS.COMPLETED || op === OPERATIONAL_STATUS.ARCHIVED;

          return (
            <div
              className={cn(
                'transition-colors group/cell',
                !isReadOnly && 'cursor-pointer hover:text-primary'
              )}
              onClick={(e) => {
                if (isReadOnly) return;
                e.stopPropagation();
                onAssign?.(record);
              }}
            >
              <div className={cn(!isReadOnly && 'group-hover/cell:underline')}>{content}</div>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.FIELD,
        key: 'field',
        width: 120,
        render: (text) => (
          <span
            className="text-xs font-medium text-slate-600 truncate block max-w-[120px]"
            title={text}
          >
            {text || PROJECT_MANAGEMENT.COMMON.N_A}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.TIMELINE,
        key: 'timeline',
        width: 150,
        render: (_, record) => {
          if (record.isOrphaned) {
            return <div className="text-slate-400">{PROJECT_MANAGEMENT.COMMON.N_A}</div>;
          }

          // AC-08 Fallback: Use group dates if project dates are null
          const gid = record.internshipId || record.internshipGroupId || record.groupId;
          const group =
            gid && Array.isArray(groups)
              ? groups.find(
                  (g) =>
                    (g.internshipId && g.internshipId.toLowerCase() === gid.toLowerCase()) ||
                    (g.id && g.id.toLowerCase() === gid.toLowerCase())
                )
              : null;

          const startSrc = record.startDate || group?.startDate;
          const endSrc = record.endDate || group?.endDate;

          if (!startSrc && !endSrc) {
            return <div className="text-gray-600 font-medium">{PROJECT_MANAGEMENT.COMMON.N_A}</div>;
          }

          const start = startSrc
            ? dayjs(startSrc).format('DD/MM/YYYY')
            : PROJECT_MANAGEMENT.COMMON.N_A;
          const end = endSrc ? dayjs(endSrc).format('DD/MM/YYYY') : PROJECT_MANAGEMENT.COMMON.N_A;

          return (
            <div className="text-[11px] font-medium tracking-tight text-slate-600">
              {start} {PROJECT_MANAGEMENT.COMMON.DASH} {end}
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.VISIBILITY,
        key: 'visibility',
        width: 80,
        align: 'center',
        render: (_, record) => {
          const vis = getVisibilityStatus(record.visibilityStatus ?? record.visibility);
          const label = VISIBILITY_LABELS[vis] || PROJECT_MANAGEMENT.COMMON.UNKNOWN;
          const variant = STATUS_VARIANTS[vis] || 'neutral';
          return <StatusBadge variant={variant} label={label} />;
        },
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'operationalStatus',
        width: 100,
        align: 'center',
        render: (_, record) => {
          const op = getOperationalStatus(record.operationalStatus ?? record.status);
          const label = OPERATIONAL_LABELS[op] || PROJECT_MANAGEMENT.COMMON.UNKNOWN;
          const variant = STATUS_VARIANTS[op] || 'neutral';
          return <StatusBadge variant={variant} label={label} />;
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 60,
        align: 'center',
        render: (_, record) => {
          const originalOp = getOperationalStatus(record.operationalStatus ?? record.status);
          const originalVis = getVisibilityStatus(record.visibilityStatus ?? record.visibility);
          const vis =
            originalVis ??
            (originalOp === OPERATIONAL_STATUS.UNSTARTED
              ? VISIBILITY_STATUS.DRAFT
              : VISIBILITY_STATUS.PUBLISHED);
          const op = originalOp;

          if (!isMentor) {
            return (
              <div className="flex justify-center">
                <Tooltip title={TABLE.ACTIONS_LABEL.VIEW}>
                  <span className="inline-flex">
                    <TableRowIconButton
                      icon={<EyeOutlined className="text-lg" />}
                      onClick={() => onView(record)}
                      className="hover:text-primary"
                    />
                  </span>
                </Tooltip>
              </div>
            );
          }

          const items = [
            {
              key: 'view',
              label: TABLE.ACTIONS_LABEL.VIEW,
              icon: <EyeOutlined />,
              onClick: () => onView(record),
            },
          ];

          // Action Matrix (AC-01)
          if (op === OPERATIONAL_STATUS.ARCHIVED) {
            // Archived + Any: View
          } else if (op === OPERATIONAL_STATUS.COMPLETED) {
            // Completed + Any: View, Archive
            items.push(
              { type: 'divider' },
              {
                key: 'archive',
                label: TABLE.ACTIONS_LABEL.ARCHIVE,
                icon: <InboxOutlined />,
                variant: 'warning',
                onClick: () => onArchive?.(record.projectId),
              }
            );
          } else if (op === OPERATIONAL_STATUS.UNSTARTED || op === OPERATIONAL_STATUS.ACTIVE) {
            items.push({ type: 'divider' });

            // Edit is available for Unstarted/Active
            items.push({
              key: 'edit',
              label: TABLE.ACTIONS_LABEL.EDIT,
              icon: <EditOutlined />,
              onClick: () => onEdit(record),
            });

            // Specific actions for Unstarted based on Visibility
            if (vis === VISIBILITY_STATUS.PUBLISHED && op === OPERATIONAL_STATUS.UNSTARTED) {
              items.push({
                key: 'unpublish',
                label: TABLE.ACTIONS_LABEL.UNPUBLISH,
                icon: <RollbackOutlined />,
                onClick: () => onUnpublish?.(record.projectId),
              });
            }

            // Group Management (Only for Unstarted)
            if (op === OPERATIONAL_STATUS.UNSTARTED) {
              items.push({
                key: 'assign',
                label: TABLE.ACTIONS_LABEL.ASSIGN_GROUP,
                icon: <UsergroupAddOutlined />,
                variant: 'success',
                onClick: () => onAssign?.(record),
              });
            }

            // Transition actions
            if (op === OPERATIONAL_STATUS.ACTIVE) {
              items.push({
                key: 'complete',
                label: TABLE.ACTIONS_LABEL.COMPLETE,
                icon: <CheckCircleOutlined />,
                variant: 'success',
                onClick: () => onComplete(record),
              });
            }

            // Delete for Unstarted or Active (AC-11)
            if (op === OPERATIONAL_STATUS.UNSTARTED || op === OPERATIONAL_STATUS.ACTIVE) {
              items.push({
                key: 'delete',
                label: TABLE.ACTIONS_LABEL.DELETE,
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => onDelete(record), // Pass full record for ownership check
              });
            }
          }

          return (
            <div className="flex justify-center">
              <TableRowDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [
      groups,
      isMentor,
      onView,
      onEdit,
      onComplete,
      onDelete,
      onArchive,
      onUnpublish,
      onAssign,
      current,
      pageSize,
      TABLE,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="projectId"
      size="small"
      minWidth="100%"
      className="project-table"
      emptyText={TABLE.EMPTY_MESSAGE}
    />
  );
}
