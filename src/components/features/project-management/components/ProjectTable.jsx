'use client';

import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import {
  PROJECT_MANAGEMENT,
  PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
} from '@/constants/project-management/project-management';

export default function ProjectTable({
  data,
  loading,
  pagination,
  groups = [],
  onChange,
  onEdit,
  onView,
  onAssign,
  onPublish,
  onComplete,
  onDelete,
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
          <div className="flex items-center gap-2">
            <div
              className="font-semibold text-primary hover:underline cursor-pointer truncate max-w-[140px]"
              title={record.projectName}
              onClick={() => onView(record)}
            >
              {record.projectName}
            </div>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.CODE,
        key: 'code',
        width: 120,
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
        title: TABLE.COLUMNS.FIELD,
        key: 'field',
        width: 100,
        render: (text) => (
          <div className="truncate w-[100px]" title={text}>
            {text || '-'}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.GROUP,
        key: 'group',
        width: 180,
        render: (_, record) => {
          const gid = record.internshipId || record.internshipGroupId || record.groupId;

          let groupName =
            record.groupInfo?.groupName || record.groupName || record.internshipGroup?.groupName;

          // If background data doesn't provide name, try mapping from groups list
          if (!groupName && gid && groups.length > 0) {
            const group = groups.find(
              (g) =>
                (g.internshipId && g.internshipId.toLowerCase() === gid.toLowerCase()) ||
                (g.id && g.id.toLowerCase() === gid.toLowerCase())
            );
            if (group) groupName = group.groupName;
          }

          const isEmptyGuid = gid === '00000000-0000-0000-0000-000000000000';
          const isMissing = !gid || isEmptyGuid || gid === '';

          if (isMissing) {
            return (
              <Tooltip title={PROJECT_MANAGEMENT.MESSAGES.ORPHANED_GROUP_TOOLTIP}>
                <div className="flex items-center gap-1.5 text-warning cursor-help whitespace-nowrap">
                  <ExclamationCircleOutlined className="text-sm" />
                  <span className="text-xs font-medium italic">
                    {PROJECT_MANAGEMENT.MESSAGES.ORPHANED_GROUP_BADGE}
                  </span>
                </div>
              </Tooltip>
            );
          }

          return (
            <div className="truncate w-[170px]" title={groupName}>
              {groupName || '-'}
            </div>
          );
        },
      },

      {
        title: TABLE.COLUMNS.TEMPLATE,
        key: 'template',
        width: 110,
        render: (template) => {
          return (
            <span className="text-gray-500 text-xs">
              {PROJECT_MANAGEMENT.FORM.TEMPLATE_LABELS[template] || 'None'}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.START_DATE,
        key: 'startDate',
        width: 100,
        render: (_, record) => (
          <div className="text-gray-600 text-[12px]">
            {record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY') : '-'}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.END_DATE,
        key: 'endDate',
        width: 100,
        render: (_, record) => (
          <div className="text-gray-600 text-[12px]">
            {record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : '-'}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'status',
        width: 70,
        render: (status) => {
          const variant = PROJECT_STATUS_VARIANTS[status] || 'default';
          const label = PROJECT_STATUS_LABELS[status] || 'Unknown';
          return (
            <Badge variant={variant} size="xs">
              {label}
            </Badge>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 90,
        render: (_, record) => {
          const items = [
            {
              key: 'view',
              label: 'View Details',
              icon: <EyeOutlined className="text-primary" />,
              onClick: () => onView(record),
            },
          ];

          if (record.status === PROJECT_STATUS.DRAFT) {
            items.push(
              { type: 'divider' },
              {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => onEdit(record),
              },
              {
                key: 'publish',
                label: 'Publish',
                icon: <RocketOutlined className="text-info" />,
                onClick: () => onPublish(record.projectId),
              },
              {
                key: 'delete',
                label: 'Delete',
                icon: <DeleteOutlined className="text-danger" />,
                danger: true,
                onClick: () => onDelete(record.projectId),
              }
            );
          } else if (record.status === PROJECT_STATUS.PUBLISHED) {
            items.push(
              { type: 'divider' },
              {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => onEdit(record),
              },
              {
                key: 'complete',
                label: 'Complete Project',
                icon: <CheckCircleOutlined className="text-success" />,
                onClick: () => onComplete(record),
              }
            );
          }

          return (
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
              <div className="flex justify-center hover:bg-gray-100 p-1 rounded cursor-pointer">
                <EllipsisOutlined className="text-lg rotate-90" />
              </div>
            </Dropdown>
          );
        },
      },
    ],
    [TABLE, current, pageSize, groups, onView, onEdit, onPublish, onComplete, onDelete]
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
      minWidth="100%"
      locale={{
        emptyText: (
          <div className="py-12 text-center">
            <p className="text-gray-400 italic">{TABLE.EMPTY_MESSAGE}</p>
          </div>
        ),
      }}
    />
  );
}
