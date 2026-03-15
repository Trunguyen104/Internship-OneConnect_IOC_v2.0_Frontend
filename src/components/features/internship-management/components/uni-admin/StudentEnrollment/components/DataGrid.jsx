'use client';

import React, { memo } from 'react';
import { Table, Avatar, Tooltip, Button, Dropdown, Tag } from 'antd';
import { EyeOutlined, EditOutlined, MoreOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';

const STATUS_STYLES = {
  placed: { color: 'success', label: 'Đã có chỗ' },
  unplaced: { color: 'default', label: 'Chưa có chỗ' },
  withdrawn: { color: 'error', label: 'Đã rút lui' },
};

const DataGrid = memo(function DataGrid({ students, onView, onEdit, onDelete }) {
  const { TABLE } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.STUDENT_ENROLLMENT;

  const columns = [
    {
      title: <span className='tracking-wider'>{TABLE.COLUMNS.FULL_NAME}</span>,
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name) => (
        <div className='flex items-center gap-3'>
          <Avatar
            size={36}
            className='bg-primary/10 text-primary border-surface border-2 text-[10px] font-bold shadow-sm'
          >
            {name?.[0].toUpperCase()}
          </Avatar>
          <span className='text-text text-sm font-bold'>{name}</span>
        </div>
      ),
    },
    {
      title: TABLE.COLUMNS.STUDENT_ID,
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <span className='text-muted font-mono text-xs font-semibold'>{text}</span>,
    },
    {
      title: TABLE.COLUMNS.MAJOR,
      dataIndex: 'major',
      key: 'major',
      width: 200,
      render: (text) => <span className='text-text text-xs'>{text}</span>,
    },
    {
      title: TABLE.COLUMNS.STATUS,
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status) => {
        const config = STATUS_STYLES[status] || STATUS_STYLES.unplaced;
        return (
          <Tag
            color={config.color}
            variant='filled'
            className='min-w-[100px] rounded-full py-0.5 text-[10px] font-black tracking-widest uppercase'
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: TABLE.COLUMNS.ACTIONS,
      key: 'actions',
      width: 120,
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
  ];

  return (
    <Table
      rowKey='id'
      columns={columns}
      dataSource={students}
      scroll={{ x: 'max-content' }}
      pagination={false}
      className='premium-table'
      rowClassName='group hover:bg-muted/5 transition-all duration-200 cursor-default'
    />
  );
});

export default DataGrid;
