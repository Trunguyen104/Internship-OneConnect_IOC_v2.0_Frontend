import { DeleteOutlined, EditOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import {
  INTERNSHIP_MANAGEMENT_UI,
  TERM_STATUS,
} from '@/constants/internship-management/internship-management';

const STATUS_VARIANTS = {
  [TERM_STATUS.UPCOMING]: 'info',
  [TERM_STATUS.ACTIVE]: 'success',
  [TERM_STATUS.ENDED]: 'warning',
  [TERM_STATUS.CLOSED]: 'danger',
};

const TermTable = memo(function TermTable({
  data,
  loading,
  page,
  pageSize,
  onEdit,
  onView,
  onRequestDelete,
  onRequestChangeStatus,
}) {
  const { TABLE, STATUS_LABELS, ACTIONS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT;

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
        title: TABLE.COLUMNS.NAME,
        dataIndex: 'name',
        key: 'name',
        render: (text) => (
          <span className="text-text block max-w-[300px] truncate text-sm font-bold tracking-tight">
            {text}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.START_DATE,
        dataIndex: 'startDate',
        key: 'startDate',
        width: 150,
        align: 'center',
        render: (date) => (
          <span className="text-muted text-xs font-medium">
            {dayjs(date).format('DD MMM, YYYY')}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.END_DATE,
        dataIndex: 'endDate',
        key: 'endDate',
        width: 150,
        align: 'center',
        render: (date) => (
          <span className="text-muted text-xs font-medium">
            {dayjs(date).format('DD MMM, YYYY')}
          </span>
        ),
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
          const status = Number(record.status);
          const isClosed = status === TERM_STATUS.CLOSED;
          const isUpcoming = status === TERM_STATUS.UPCOMING;
          const isActive = status === TERM_STATUS.ACTIVE;

          return (
            <div className="flex items-center justify-end gap-1.5">
              <Tooltip title={ACTIONS.VIEW}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(record);
                  }}
                />
              </Tooltip>

              {!isClosed && (
                <Tooltip title={ACTIONS.EDIT}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(record);
                    }}
                  />
                </Tooltip>
              )}

              {isUpcoming && (
                <Tooltip title={ACTIONS.DELETE}>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    className="hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDelete(record);
                    }}
                  />
                </Tooltip>
              )}

              {isActive && (
                <Tooltip title={ACTIONS.CLOSE}>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<StopOutlined />}
                    className="hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestChangeStatus(record, TERM_STATUS.CLOSED);
                    }}
                  />
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ],
    [
      page,
      pageSize,
      TABLE,
      STATUS_LABELS,
      ACTIONS,
      onRequestChangeStatus,
      onEdit,
      onView,
      onRequestDelete,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="termId"
      className="mt-4"
      pagination={{
        current: page,
        pageSize: pageSize,
        total: data?.totalCount || data?.length, // Assuming data has totalCount or it's the full list
      }}
    />
  );
});

export default TermTable;
