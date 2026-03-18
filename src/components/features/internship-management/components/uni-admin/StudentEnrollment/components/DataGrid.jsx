'use client';

import React, { memo, useMemo } from 'react';
import { Avatar, Tooltip, Button, Dropdown, Tag } from 'antd';
import { EyeOutlined, EditOutlined, MoreOutlined, UserDeleteOutlined } from '@ant-design/icons';
import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const STATUS_STYLES = {
  placed: { color: 'success', label: 'Đã có chỗ' },
  unplaced: { color: 'default', label: 'Chưa có chỗ' },
  withdrawn: { color: 'error', label: 'Đã rút lui' },
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
  const { TABLE } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.STUDENT_ENROLLMENT;

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
        width: '220px',
        render: (_, record) => (
          <div className='flex items-center gap-3'>
            <Avatar
              size={36}
              className='bg-primary/10 text-primary border-surface border-2 text-[10px] font-bold shadow-sm'
            >
              {record.name?.[0].toUpperCase()}
            </Avatar>
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
        width: '150px',
        align: 'center',
        render: (_, record) => {
          const config = STATUS_STYLES[record.status] || STATUS_STYLES.unplaced;
          return (
            <Tag
              color={config.color}
              className='min-w-[100px] rounded-full border-none px-3 text-[10px] font-bold uppercase'
            >
              {config.label}
            </Tag>
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
            <Tooltip title='Xem chi tiết'>
              <Button
                type='text'
                icon={<EyeOutlined />}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onView(record);
                }}
              />
            </Tooltip>
            <Tooltip title='Chỉnh sửa'>
              <Button
                type='text'
                icon={<EditOutlined />}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(record);
                }}
              />
            </Tooltip>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'delete',
                    label: 'Xóa khỏi đợt thực tập',
                    icon: <UserDeleteOutlined />,
                    danger: true,
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      onDelete(record);
                    },
                  },
                ],
              }}
              trigger={['click']}
              placement='bottomRight'
              overlayClassName='min-w-[180px] rounded-xl overflow-hidden shadow-xl border border-border'
            >
              <Button
                type='text'
                icon={<MoreOutlined />}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center rounded-lg p-0 transition-all'
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete, TABLE, page, pageSize],
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
