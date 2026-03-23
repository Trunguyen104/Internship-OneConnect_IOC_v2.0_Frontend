'use client';

import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MinusCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';

import { STUDENT_ENROLLMENT } from '../constants/enrollment';

const STATUS_CONFIG = {
  PLACED: {
    icon: <CheckCircleFilled className="text-success" />,
    bgClass: 'bg-success-surface',
    textClass: 'text-success',
  },
  ACTIVE: {
    icon: <CheckCircleFilled className="text-success" />,
    bgClass: 'bg-success-surface',
    textClass: 'text-success',
  },
  UNPLACED: {
    icon: <MinusCircleFilled className="text-info" />,
    bgClass: 'bg-info-surface',
    textClass: 'text-info',
  },
  WITHDRAWN: {
    icon: <CloseCircleFilled className="text-danger" />,
    bgClass: 'bg-danger-surface',
    textClass: 'text-danger',
  },
  default: {
    icon: <MinusCircleFilled className="text-muted" />,
    bgClass: 'bg-muted/10',
    textClass: 'text-muted',
  },
};

const DataGrid = memo(function DataGrid({
  data,
  loading,
  page = 1,
  pageSize = 10,
  selectedRowKeys,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  onRestore,
  sortBy,
  sortOrder,
  onSort,
  readOnly = false,
}) {
  const { TABLE, ACTIONS, STATUS_LABELS, PLACEMENT_LABELS } = STUDENT_ENROLLMENT;

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
        sortKey: 'fullname',
        width: '230px',
        render: (_, record) => (
          <div className="flex items-center gap-3">
            <span className="text-text text-sm font-semibold">{record.name}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STUDENT_ID,
        key: 'id',
        sortKey: 'studentcode',
        width: '140px',
        render: (_, record) => (
          <span className="text-muted font-mono text-xs font-semibold">{record.id}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.MAJOR,
        key: 'major',
        width: '200px',
        render: (_, record) => <span className="text-text text-xs">{record.major}</span>,
      },
      {
        title: TABLE.COLUMNS.PLACEMENT,
        key: 'placement',
        width: '180px',
        render: (_, record) => {
          const isPlaced = record.placementStatus === 'PLACED';
          return (
            <div className="flex flex-col">
              {isPlaced ? (
                <span className="text-text text-[11px] font-bold uppercase tracking-wider truncate max-w-[150px]">
                  {record.enterpriseName}
                </span>
              ) : (
                <span className="text-muted text-[11px] font-bold uppercase tracking-wider">
                  {PLACEMENT_LABELS.UNPLACED}
                </span>
              )}
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: '120px',
        align: 'center',
        render: (status) => {
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
          return (
            <span
              className={`${config.bgClass} ${config.textClass} inline-flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold uppercase transition-all`}
            >
              {STATUS_LABELS[status] || status}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: '140px',
        align: 'right',
        render: (_, record) => {
          const isWithdrawn = record.status === 'WITHDRAWN';

          return (
            <div className="flex items-center justify-end gap-1">
              <Tooltip title={ACTIONS.VIEW}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all"
                  onClick={() => onView(record)}
                />
              </Tooltip>
              {!readOnly && (
                <>
                  {!isWithdrawn ? (
                    <>
                      <Tooltip title={ACTIONS.EDIT}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all"
                          onClick={() => onEdit(record)}
                        />
                      </Tooltip>
                      <Tooltip title={ACTIONS.DELETE}>
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all"
                          onClick={() => onDelete(record)}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip title={ACTIONS.RECOVER}>
                      <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                        className="hover:bg-success/10 hover:text-success text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all"
                        onClick={() => onRestore(record)}
                      />
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          );
        },
      },
    ],
    [
      onView,
      onEdit,
      onDelete,
      onRestore,
      onSort,
      TABLE,
      STATUS_LABELS,
      ACTIONS,
      page,
      pageSize,
      readOnly,
      PLACEMENT_LABELS.UNPLACED,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="studentTermId"
      minWidth="1000px"
      className="mt-2 min-h-0 flex-1"
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectionChange,
      }}
    />
  );
});

export default DataGrid;
