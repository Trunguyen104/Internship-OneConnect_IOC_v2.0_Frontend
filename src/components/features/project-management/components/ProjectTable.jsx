'use client';

import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  RollbackOutlined,
  SwapOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
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
  onChange,
  onEdit,
  onView,
  onAssign,
  onPublish,
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
        width: 140,
        render: (text, record) => (
          <div
            className="font-semibold text-primary hover:underline cursor-pointer truncate max-w-[140px]"
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
            className="text-gray-500 truncate w-[100px]"
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
            if (record.isOrphaned) {
              content = (
                <div className="text-red-500 font-medium text-[10px] leading-tight flex flex-col gap-0.5 w-[150px]">
                  <div className="flex items-center gap-1 font-bold">
                    <ExclamationCircleOutlined /> {TABLE.STATUS_TEXT.ORPHANED_TITLE}
                  </div>
                  <span className="text-[9px] opacity-90 uppercase italic">
                    {TABLE.STATUS_TEXT.ORPHANED_HINT}
                  </span>
                </div>
              );
            } else {
              content = (
                <span className="text-red-500 italic text-xs font-medium">
                  {TABLE.STATUS_TEXT.NO_GROUP}
                </span>
              );
            }
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
                    className="text-[9px] px-1.5 py-0 bg-gray-100 text-gray-500 border-gray-200"
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
        width: 100,
        render: (text) => (
          <div className="truncate w-[100px]" title={text}>
            {text || PROJECT_MANAGEMENT.COMMON.N_A}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.TIMELINE,
        key: 'timeline',
        width: 160,
        render: (_, record) => {
          if (record.isOrphaned) {
            return <div className="text-gray-400">{PROJECT_MANAGEMENT.COMMON.N_A}</div>;
          }
          const start = record.startDate
            ? dayjs(record.startDate).format('DD/MM/YYYY')
            : PROJECT_MANAGEMENT.COMMON.N_A;
          const end = record.endDate
            ? dayjs(record.endDate).format('DD/MM/YYYY')
            : PROJECT_MANAGEMENT.COMMON.N_A;
          return (
            <div className="text-gray-600 text-[11px] font-medium tracking-tight">
              {start} {PROJECT_MANAGEMENT.COMMON.DASH} {end}
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.VISIBILITY,
        key: 'visibility',
        width: 90,
        align: 'center',
        render: (_, record) => {
          const vis = getVisibilityStatus(record.visibilityStatus ?? record.visibility);
          const label = VISIBILITY_LABELS[vis] || PROJECT_MANAGEMENT.COMMON.UNKNOWN;
          const variant = STATUS_VARIANTS[vis] || 'default';
          return (
            <Badge variant={variant} size="xs" className="uppercase tracking-tighter">
              {label}
            </Badge>
          );
        },
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'operationalStatus',
        width: 110,
        align: 'center',
        render: (_, record) => {
          const op = getOperationalStatus(record.operationalStatus ?? record.status);
          const label = OPERATIONAL_LABELS[op] || PROJECT_MANAGEMENT.COMMON.UNKNOWN;
          const variant = STATUS_VARIANTS[op] || 'default';
          return (
            <Badge variant={variant} size="xs" className="font-bold">
              {label}
            </Badge>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 80,
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
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-primary/10 text-primary cursor-pointer transition-colors"
                    onClick={() => onView(record)}
                  >
                    <EyeOutlined style={{ fontSize: 18 }} />
                  </div>
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

            // Group Management
            items.push({
              key: 'assign',
              label:
                op === OPERATIONAL_STATUS.UNSTARTED
                  ? TABLE.ACTIONS_LABEL.ASSIGN_GROUP
                  : TABLE.ACTIONS_LABEL.CHANGE_GROUP,
              icon:
                op === OPERATIONAL_STATUS.UNSTARTED ? <UsergroupAddOutlined /> : <SwapOutlined />,
              onClick: () => onAssign?.(record),
            });

            // Transition actions
            if (op === OPERATIONAL_STATUS.ACTIVE) {
              items.push({
                key: 'complete',
                label: TABLE.ACTIONS_LABEL.COMPLETE,
                icon: <CheckCircleOutlined className="text-success" />,
                onClick: () => onComplete(record),
              });
            }

            // Delete for Unstarted or Active (AC-11)
            if (op === OPERATIONAL_STATUS.UNSTARTED || op === OPERATIONAL_STATUS.ACTIVE) {
              items.push({
                key: 'delete',
                label: TABLE.ACTIONS_LABEL.DELETE,
                icon: <DeleteOutlined className="text-danger" />,
                danger: true,
                onClick: () => onDelete(record), // Pass full record for ownership check
              });
            }
          }

          return (
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
              <div className="flex justify-center hover:bg-gray-100 p-1 rounded cursor-pointer transition-colors w-8 h-8 items-center mx-auto">
                <EllipsisOutlined className="text-lg rotate-90" />
              </div>
            </Dropdown>
          );
        },
      },
    ],
    [
      groups,
      isMentor,
      onView,
      onEdit,
      onPublish,
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
      pagination={pagination}
      onChange={onChange}
      rowKey="projectId"
      size="small"
      minWidth="1000px"
      className="project-table"
      locale={{
        emptyText: (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium italic">{TABLE.EMPTY_MESSAGE}</p>
          </div>
        ),
      }}
    />
  );
}
