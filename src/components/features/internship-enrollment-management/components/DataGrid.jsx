import { DeleteOutlined, EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { memo, useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const STATUS_VARIANTS = {
  PLACED: 'success',
  ACTIVE: 'success',
  UNPLACED: 'info',
  WITHDRAWN: 'danger',
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
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { TABLE, ACTIONS, STATUS_LABELS, PLACEMENT_LABELS } = ENROLLMENT_MANAGEMENT;

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 80,
        align: 'center',
        render: (_, __, index) => (
          <span className="text-muted font-mono text-xs font-bold">
            {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.FULL_NAME,
        dataIndex: 'name',
        key: 'name',
        sorter: true,
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
        render: (id) => <span className="text-muted font-mono text-xs font-semibold">{id}</span>,
      },
      {
        title: TABLE.COLUMNS.MAJOR,
        dataIndex: 'major',
        key: 'major',
        render: (major) => <span className="text-text text-xs font-medium">{major}</span>,
      },
      {
        title: TABLE.COLUMNS.PLACEMENT,
        key: 'placement',
        width: 200,
        render: (_, record) => {
          const isPlaced = record.placementStatus === 'PLACED';
          return (
            <div className="flex flex-col gap-0.5">
              {isPlaced ? (
                <span className="text-text max-w-[180px] truncate text-[11px] font-bold uppercase tracking-wider">
                  {record.enterpriseName || PLACEMENT_LABELS.PLACED}
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
        width: 140,
        align: 'center',
        render: (status) => {
          const variant = STATUS_VARIANTS[status] || 'default';
          const label = STATUS_LABELS[status] || status;
          return <Badge variant={variant}>{label}</Badge>;
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
              <Tooltip title={ACTIONS.VIEW}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
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
                          className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                          onClick={() => onEdit(record)}
                        />
                      </Tooltip>
                      <Tooltip title={ACTIONS.DELETE}>
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
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
                        className="hover:bg-success/10 hover:text-success text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
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
      className="mt-4"
      onChange={(pagination, filters, sorter) => {
        if (sorter.field) {
          onSort?.(sorter.field, sorter.order === 'ascend' ? 'Asc' : 'Desc');
        }
      }}
      rowSelection={
        onSelectionChange
          ? {
              selectedRowKeys,
              onChange: onSelectionChange,
            }
          : undefined
      }
      pagination={{
        current: page,
        pageSize: pageSize,
        total: data?.totalCount || data?.length,
      }}
    />
  );
});

export default DataGrid;
