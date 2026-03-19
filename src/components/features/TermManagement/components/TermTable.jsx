import React, { memo, useMemo } from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const STATUS_CONFIG = {
  1: {
    bgClass: '!bg-info-surface',
    textClass: '!text-info',
  },
  2: {
    bgClass: '!bg-success-surface',
    textClass: '!text-success',
  },
  3: {
    bgClass: '!bg-warning-surface',
    textClass: '!text-warning',
  },
  4: {
    bgClass: '!bg-danger-surface',
    textClass: '!text-danger',
  },
  Upcoming: {
    bgClass: '!bg-info-surface',
    textClass: '!text-info',
  },
  Active: {
    bgClass: '!bg-success-surface',
    textClass: '!text-success',
  },
  Ended: {
    bgClass: '!bg-warning-surface',
    textClass: '!text-warning',
  },
  Closed: {
    bgClass: '!bg-danger-surface',
    textClass: '!text-danger',
  },
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
  const { TABLE } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT;

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
        title: TABLE.COLUMNS.NAME,
        key: 'name',
        width: '230px',
        render: (text) => <span className='text-text text-sm font-bold'>{text}</span>,
      },
      {
        title: TABLE.COLUMNS.START_DATE,
        key: 'startDate',
        width: '130px',
        align: 'center',
        render: (date) => (
          <span className='text-muted text-sm'>{dayjs(date).format('DD/MM/YYYY')}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.END_DATE,
        key: 'endDate',
        width: '130px',
        align: 'center',
        render: (date) => (
          <span className='text-muted text-sm'>{dayjs(date).format('DD/MM/YYYY')}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'status',
        width: '120px',
        align: 'center',
        render: (status) => {
          const config = STATUS_CONFIG[status] || {
            bgClass: '!bg-gray-100',
            textClass: '!text-gray-500',
          };
          const label =
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[status] || status;
          return (
            <span
              className={`${config.bgClass} ${config.textClass} m-0 inline-flex h-6 w-fit items-center justify-center rounded-full px-2.5 text-[10px] font-bold uppercase transition-all`}
            >
              {label}
            </span>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: '120px',
        align: 'right',
        render: (_, record) => {
          const isClosed = record.status === 'Closed' || record.status === 4;
          const isUpcoming = record.status === 'Upcoming' || record.status === 1;
          const isActive = record.status === 'Active' || record.status === 2;

          return (
            <div className='flex items-center justify-end gap-1'>
              {/* View Action - Always visible */}
              <Tooltip title={INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.VIEW}>
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

              {/* Edit Action - Visible if not closed */}
              {!isClosed && (
                <Tooltip title={INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.EDIT}>
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
              )}

              {/* Delete Action - Visible only if upcoming */}
              {isUpcoming && (
                <Tooltip title={INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.DELETE}>
                  <Button
                    type='text'
                    size='small'
                    danger
                    icon={<DeleteOutlined />}
                    className='hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDelete(record);
                    }}
                  />
                </Tooltip>
              )}

              {/* Close Action - Visible only if active */}
              {isActive && (
                <Tooltip title={INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.CLOSE}>
                  <Button
                    type='text'
                    size='small'
                    danger
                    icon={<StopOutlined />}
                    className='hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestChangeStatus(record, 4); // 4 is Closed
                    }}
                  />
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ],
    [page, pageSize, TABLE, onRequestChangeStatus, onEdit, onView, onRequestDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey='termId'
      minWidth='800px'
      className='mt-2 min-h-0 flex-1'
    />
  );
});

export default TermTable;
