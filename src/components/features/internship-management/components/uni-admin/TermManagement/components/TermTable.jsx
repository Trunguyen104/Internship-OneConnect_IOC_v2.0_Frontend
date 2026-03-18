import React, { memo, useMemo } from 'react';
import { Tag, Button, Dropdown, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import DataTable from '@/components/ui/DataTable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const STATUS_CONFIG = {
  0: { color: 'processing' },
  1: { color: 'success' },
  2: { color: 'warning' },
  3: { color: 'error' },
};

const TermTable = memo(function TermTable({
  data,
  loading,
  page,
  pageSize,
  onEdit,
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
          const config = STATUS_CONFIG[status] || { color: 'default' };
          const label =
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[status] || status;
          return (
            <Tag
              bordered={false}
              color={config.color}
              className='bg-transparent px-0 text-[10px] font-bold uppercase'
            >
              {label}
            </Tag>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: '120px',
        align: 'right',
        render: (_, record) => {
          const isClosed = record.status === 'Closed' || record.status === 3;
          const isUpcoming = record.status === 'Upcoming' || record.status === 0;
          const isActive = record.status === 'Active' || record.status === 1;

          const menuItems = [];
          if (isActive) {
            menuItems.push({
              key: 'close',
              label: (
                <span className='text-xs font-semibold'>
                  {INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.CLOSE}
                </span>
              ),
              onClick: (e) => {
                e.domEvent.stopPropagation();
                onRequestChangeStatus(record, 3);
              },
            });
          }

          return (
            <div className='flex items-center justify-end gap-1'>
              <Tooltip
                title={
                  isClosed
                    ? INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.VIEW
                    : INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.ACTIONS.EDIT
                }
              >
                <Button
                  type='text'
                  size='small'
                  icon={isClosed ? <EyeOutlined /> : <EditOutlined />}
                  className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                />
              </Tooltip>

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

              {menuItems.length > 0 && (
                <Dropdown menu={{ items: menuItems }} trigger={['click']} placement='bottomRight'>
                  <Button
                    type='text'
                    size='small'
                    icon={<EllipsisOutlined />}
                    className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              )}
            </div>
          );
        },
      },
    ],
    [page, pageSize, TABLE, onRequestChangeStatus, onEdit, onRequestDelete],
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
