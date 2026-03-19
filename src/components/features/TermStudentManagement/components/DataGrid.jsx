'use client';

import React, { memo, useMemo } from 'react';
import { Tooltip, Button } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const STATUS_CONFIG = {
  INTERNSHIP: {
    icon: <MinusCircleFilled className='text-info' />,
    bgClass: '!bg-info-surface',
    textClass: '!text-info',
  },
  COMPLETED: {
    icon: <CheckCircleFilled className='text-success' />,
    bgClass: '!bg-success-surface',
    textClass: '!text-success',
  },
  WITHDRAWN: {
    icon: <CloseCircleFilled className='text-danger' />,
    bgClass: '!bg-danger-surface',
    textClass: '!text-danger',
  },
  default: {
    icon: <MinusCircleFilled className='text-gray-400' />,
    bgClass: '!bg-gray-100',
    textClass: '!text-gray-500',
  },
};

const DataGrid = memo(function DataGrid({
  students,
  loading,
  page = 1,
  pageSize = 10,
  onView,
  onEdit,
  onDelete,
}) {
  const { STUDENT_ENROLLMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { TABLE, STATUS_LABELS, ACTIONS } = STUDENT_ENROLLMENT;

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
        title: TABLE.COLUMNS.FULL_NAME,
        key: 'name',
        width: '230px',
        render: (_, record) => (
          <div className='flex items-center gap-3'>
            <span className='text-text text-sm font-bold'>{record.name}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STUDENT_ID,
        key: 'id',
        width: '120px',
        render: (_, record) => (
          <span className='text-muted font-mono text-xs font-semibold'>{record.id}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.MAJOR,
        key: 'major',
        width: '200px',
        render: (_, record) => <span className='text-text text-xs'>{record.major}</span>,
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'status',
        width: '160px',
        align: 'center',
        render: (status) => {
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
          const label = STATUS_LABELS[status] || status;
          return (
            <div
              className={`m-0 inline-flex h-6 w-fit items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 ${config.bgClass}`}
            >
              <span className='flex items-center text-xs'>{config.icon}</span>
              <span
                className={`${config.textClass} text-[10px] leading-none font-black tracking-wider uppercase transition-all`}
              >
                {label}
              </span>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: '120px',
        align: 'right',
        render: (_, record) => (
          <div className='flex items-center justify-end gap-1'>
            <Tooltip title={ACTIONS.VIEW}>
              <Button
                type='text'
                size='small'
                icon={<EyeOutlined />}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onView(record);
                }}
              />
            </Tooltip>
            <Tooltip title={ACTIONS.EDIT}>
              <Button
                type='text'
                size='small'
                icon={<EditOutlined />}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(record);
                }}
              />
            </Tooltip>
            <Tooltip title={ACTIONS.DELETE}>
              <Button
                type='text'
                size='small'
                danger
                icon={<DeleteOutlined />}
                className='hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(record);
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete, TABLE, STATUS_LABELS, ACTIONS, page, pageSize],
  );

  return (
    <DataTable
      columns={columns}
      data={students}
      loading={loading}
      rowKey='id'
      minWidth='800px'
      className='no-scrollbar mt-2 min-h-0 flex-1'
    />
  );
});

export default DataGrid;
