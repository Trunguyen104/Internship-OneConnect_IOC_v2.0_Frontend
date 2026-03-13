'use client';
import React, { memo } from 'react';
import { Table, Space, Avatar, Tooltip, Button, Dropdown } from 'antd';
import { EyeOutlined, EditOutlined, MoreOutlined, UserDeleteOutlined } from '@ant-design/icons';

const STATUS_STYLES = {
  placed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Placed',
    dot: 'bg-green-500',
  },
  unplaced: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    label: 'Unplaced',
    dot: 'bg-slate-400',
  },
  withdrawn: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Withdrawn',
    dot: 'bg-red-500',
  },
};

const DataGrid = memo(function DataGrid({ students, onView, onEdit, onDelete }) {
  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <Avatar size={32} className='bg-slate-200 text-slate-700'>
            {name?.[0]}
          </Avatar>
          <span className='font-medium'>{name}</span>
        </Space>
      ),
    },
    {
      title: 'MSSV',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <span className='font-mono text-slate-600'>{text}</span>,
    },
    {
      title: 'Ngành học',
      dataIndex: 'major',
      key: 'major',
      render: (text) => <span className='text-slate-600'>{text}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const style = STATUS_STYLES[status] || STATUS_STYLES.unplaced;
        return (
          <span
            className={`rounded-full border px-3 py-1 text-xs ${style.bg} ${style.text} ${style.border}`}
          >
            {style.label}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2 text-slate-400'>
          <Tooltip title='Xem chi tiết'>
            <Button
              type='text'
              shape='circle'
              icon={<EyeOutlined />}
              className='hover:bg-primary/5 hover:text-primary'
              onClick={(e) => {
                e.stopPropagation();
                onView(record);
              }}
            />
          </Tooltip>
          <Tooltip title='Chỉnh sửa'>
            <Button
              type='text'
              shape='circle'
              icon={<EditOutlined />}
              className='hover:bg-primary/5 hover:text-primary'
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
                  label: 'Xóa sinh viên',
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
          >
            <Tooltip title='Tùy chọn'>
              <Button
                type='text'
                shape='circle'
                icon={<MoreOutlined />}
                className='hover:bg-primary/5 hover:text-primary'
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Dropdown>
        </div>
      ),
      width: 140,
    },
  ];

  return (
    <Table
      rowKey='id'
      columns={columns}
      dataSource={students}
      scroll={{ x: 'max-content' }}
      pagination={false}
      className='custom-antd-table'
    />
  );
});

export default DataGrid;
