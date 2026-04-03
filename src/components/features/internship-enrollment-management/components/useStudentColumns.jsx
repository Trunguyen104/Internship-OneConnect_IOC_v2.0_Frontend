import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { useMemo } from 'react';

import StatusBadge from '@/components/ui/status-badge';

export const useStudentColumns = ({
  pagination,
  isClosed,
  handleView,
  handleEdit,
  handleEdit,
  handleDelete,
  TABLE,
  ACTION_LABELS,
  STATUS_LABELS,
  PLACEMENT_LABELS,
}) => {
  const STATUS_VARIANTS = {
    PLACED: 'success',
    ACTIVE: 'success',
    UNPLACED: 'warning',
    WITHDRAWN: 'danger',
  };

  return useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 80,
        align: 'center',
        render: (_, __, index) => (
          <span className="text-muted font-mono text-xs font-bold">
            {String((pagination.current - 1) * pagination.pageSize + index + 1).padStart(2, '0')}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.FULL_NAME,
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        sortKey: 'FullName',
        render: (name) => (
          <span className="text-text text-sm font-bold tracking-tight">{name}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.STUDENT_ID,
        dataIndex: 'id',
        key: 'id',
        width: 140,
        sorter: true,
        sortKey: 'StudentId',
        render: (id) => <span className="text-muted font-mono text-xs font-semibold">{id}</span>,
      },
      {
        title: TABLE.COLUMNS.MAJOR,
        dataIndex: 'major',
        key: 'major',
        render: (major) => (
          <Tooltip title={major}>
            <span className="text-text block max-w-[150px] truncate text-xs font-medium whitespace-nowrap">
              {major}
            </span>
          </Tooltip>
        ),
      },
      {
        title: TABLE.COLUMNS.PLACEMENT,
        key: 'placement',
        width: 200,
        render: (_, record) => {
          const isPlaced = record.placementStatus === 'PLACED';
          return (
            <div className="flex flex-col gap-0.5">
              <Tooltip
                title={
                  isPlaced
                    ? record.enterpriseName || PLACEMENT_LABELS.PLACED
                    : PLACEMENT_LABELS.UNPLACED
                }
              >
                <span
                  className={`block truncate text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    isPlaced ? 'text-text max-w-[180px]' : 'text-muted'
                  }`}
                >
                  {isPlaced
                    ? record.enterpriseName || PLACEMENT_LABELS.PLACED
                    : PLACEMENT_LABELS.UNPLACED}
                </span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: 140,
        align: 'center',
        render: (status) => {
          const variant = STATUS_VARIANTS[status] || 'default';
          const label = STATUS_LABELS[status] || status;
          return <StatusBadge variant={variant} label={label} />;
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 160,
        align: 'right',
        render: (_, record) => {
          const isWithdrawn = record.status === 'WITHDRAWN';

          return (
            <div className="flex items-center justify-end gap-1.5">
              <Tooltip title={ACTION_LABELS.VIEW}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(record);
                  }}
                />
              </Tooltip>
              {!isClosed && (
                <>
                  {!isWithdrawn && (
                    <>
                      <Tooltip title={ACTION_LABELS.EDIT}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                          }}
                        />
                      </Tooltip>
                      <Tooltip title={ACTION_LABELS.DELETE}>
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.current, pagination.pageSize, isClosed, STATUS_LABELS, PLACEMENT_LABELS, TABLE]
  );
};
