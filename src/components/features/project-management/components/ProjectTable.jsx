'use client';

import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  RocketOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import {
  INTERNSHIP_MANAGEMENT_UI,
  PROJECT_STATUS,
  PROJECT_STATUS_VARIANTS,
} from '@/constants/internship-management/internship-management';

export default function ProjectTable({
  data,
  loading,
  pagination,
  onChange,
  onEdit,
  onView,
  onAssign,
  onPublish,
  onComplete,
  onDelete,
}) {
  const { PROJECT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { TABLE } = PROJECT_MANAGEMENT;

  const columns = useMemo(
    () => [
      {
        title: TABLE.COLUMNS.INDEX,
        key: 'index',
        width: 40,
        render: (_, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      {
        title: TABLE.COLUMNS.NAME,
        key: 'name',
        width: 150,
        render: (text, record) => (
          <div
            className="font-semibold text-primary hover:underline cursor-pointer truncate w-[160px]"
            title={record.name}
            onClick={() => onView(record)}
          >
            {record.name}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.CODE,
        key: 'code',
        width: 100,
        render: (text) => (
          <div className="text-gray-500 truncate w-[80px]" title={text}>
            {text}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.GROUP,
        key: 'group',
        width: 120,
        render: (_, record) => (
          <div className="truncate w-[120px]" title={record.internshipGroup?.internshipGroupName}>
            {record.internshipGroup?.internshipGroupName || '-'}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.FIELD,
        key: 'field',
        width: 120,
        render: (text) => (
          <div className="truncate w-[110px]" title={text}>
            {text}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.START_DATE,
        key: 'startDate',
        width: 100,
        render: (_, record) => (
          <div className="text-gray-600 text-[13px]">
            {record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY') : '-'}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.END_DATE,
        key: 'endDate',
        width: 100,
        render: (_, record) => (
          <div className="text-gray-600 text-[13px]">
            {record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : '-'}
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'status',
        width: 50,
        render: (status) => {
          const variant = PROJECT_STATUS_VARIANTS[status] || 'default';
          const label =
            status === PROJECT_STATUS.DRAFT
              ? 'Draft'
              : status === PROJECT_STATUS.PUBLISHED
                ? 'Pub'
                : status === PROJECT_STATUS.COMPLETED
                  ? 'Done'
                  : 'Err';
          return (
            <Badge variant={variant} size="sm" className="px-1.5">
              {label}
            </Badge>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 70,
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
                key: 'assign',
                label: 'Assign Students',
                icon: <UserAddOutlined className="text-primary" />,
                onClick: () => onAssign(record),
              },
              {
                key: 'complete',
                label: 'Complete Project',
                icon: <CheckCircleOutlined className="text-success" />,
                onClick: () => onComplete(record.projectId),
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
    [TABLE, pagination, onView, onEdit, onPublish, onComplete, onDelete, onAssign]
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
    />
  );
}
