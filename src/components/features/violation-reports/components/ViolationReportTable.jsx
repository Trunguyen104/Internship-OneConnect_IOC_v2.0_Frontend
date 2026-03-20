'use client';

import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';

import { VIOLATION_REPORT_UI } from '../constants/violationReportUI';

const ViolationReportTable = memo(function ViolationReportTable({
  data,
  loading,
  page,
  pageSize,
  onView,
  onEdit,
  onDelete,
  currentUserId,
  selectedRowKeys = [],
  onSelectRowChange,
}) {
  const { TABLE } = VIOLATION_REPORT_UI;

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectRowChange,
  };

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: '60px',
        align: 'center',
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
        className: 'text-muted font-semibold text-xs',
      },
      {
        title: VIOLATION_REPORT_UI.TABLE.COLUMNS.STUDENT_NAME,
        dataIndex: 'studentName',
        key: 'studentName',
        width: 160,
        render: (text, record) => (
          <div className="flex flex-col overflow-hidden">
            <span className="text-text truncate text-sm font-bold">{text}</span>
            <span className="text-muted truncate text-[11px] font-medium tracking-wider uppercase opacity-60">
              {record.studentCode}
            </span>
          </div>
        ),
      },
      {
        title: VIOLATION_REPORT_UI.TABLE.COLUMNS.INTERN_GROUP,
        dataIndex: 'internGroupName',
        key: 'internGroupName',
        width: 120,
        render: (text) => (
          <span className="text-text truncate text-xs font-bold">{text || '-'}</span>
        ),
      },
      {
        title: VIOLATION_REPORT_UI.TABLE.COLUMNS.INCIDENT_DATE,
        dataIndex: 'incidentDate',
        key: 'incidentDate',
        width: 110,
        render: (date) => (
          <span className="text-muted text-xs font-semibold">
            {date ? dayjs(date).format('DD/MM/YYYY') : '-'}
          </span>
        ),
      },
      {
        title: VIOLATION_REPORT_UI.TABLE.COLUMNS.CREATED_TIME,
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 120,
        render: (time) => (
          <span className="text-muted text-xs opacity-80">
            {time ? dayjs(time).format('DD/MM/YYYY HH:mm') : '-'}
          </span>
        ),
      },
      {
        title: VIOLATION_REPORT_UI.TABLE.COLUMNS.DESCRIPTION,
        dataIndex: 'description',
        key: 'description',
        width: 200,
        render: (text) => (
          <Tooltip title={text}>
            <span className="text-muted line-clamp-1 truncate text-xs italic opacity-80">
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: VIOLATION_REPORT_UI.TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 40,
        align: 'center',
        render: (_, record) => {
          const isOwner = record.createdBy === currentUserId;
          const items = [
            {
              key: 'view',
              label: VIOLATION_REPORT_UI.TABLE.ACTIONS.VIEW,
              icon: <EyeOutlined className="text-primary" />,
              onClick: () => onView(record),
            },
            ...(isOwner
              ? [
                  { type: 'divider' },
                  {
                    key: 'edit',
                    label: VIOLATION_REPORT_UI.TABLE.ACTIONS.EDIT,
                    icon: <EditOutlined className="text-primary" />,
                    onClick: () => onEdit(record),
                  },
                  {
                    key: 'delete',
                    label: VIOLATION_REPORT_UI.TABLE.ACTIONS.DELETE,
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
                  className="hover:bg-primary/10 text-muted flex h-8 w-8 items-center justify-center rounded-lg"
                />
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [page, pageSize, onView, onEdit, onDelete, currentUserId]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      rowSelection={rowSelection}
      minWidth="780px"
      tableLayout="fixed"
      className="no-scrollbar mt-2 min-h-0 flex-1"
      onRowClick={onView}
    />
  );
});

export default ViolationReportTable;
