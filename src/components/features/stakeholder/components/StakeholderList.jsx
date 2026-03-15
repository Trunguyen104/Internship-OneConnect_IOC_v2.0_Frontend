'use client';

import React, { memo } from 'react';
import { Table, Button, Tag, Avatar, Tooltip, Empty, Spin } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';

const StakeholderList = memo(function StakeholderList({ stakeholders, loading, onEdit, onDelete }) {
  const columns = [
    {
      title: STAKEHOLDER_UI.TABLE_NO,
      key: 'index',
      width: 70,
      render: (_, __, index) => <span className='text-muted font-medium'>{index + 1}</span>,
    },
    {
      title: STAKEHOLDER_UI.FIELD_NAME,
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className='flex items-center gap-3'>
          <Avatar
            icon={<UserOutlined />}
            className='bg-primary/10 text-primary border-none'
            size={40}
          />
          <div className='flex min-w-0 flex-col'>
            <span className='text-text block truncate text-[15px] font-bold'>{name}</span>
            {record.description && (
              <span className='text-muted block truncate text-[11px] font-medium'>
                {record.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_ROLE,
      dataIndex: 'role',
      key: 'role',
      width: 180,
      render: (role) => (
        <Tag
          color='processing'
          variant='filled'
          className='m-0 rounded-full px-4 py-0.5 text-[10px] font-black tracking-widest uppercase'
        >
          {role || STAKEHOLDER_UI.NO_ROLE}
        </Tag>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_EMAIL,
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <div className='flex items-center gap-2'>
          <MailOutlined className='text-muted text-xs' />
          <span className='text-text text-sm font-medium'>{email}</span>
        </div>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_PHONE,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 160,
      render: (phone) => (
        <div className='flex items-center gap-2'>
          <PhoneOutlined className='text-muted text-xs' />
          <span className='text-text text-sm font-medium'>{phone || '—'}</span>
        </div>
      ),
    },
    {
      title: STAKEHOLDER_UI.ACTIONS,
      key: 'actions',
      fixed: 'right',
      width: 100,
      align: 'right',
      render: (_, record) => (
        <div className='flex items-center justify-end gap-1'>
          <Tooltip title={STAKEHOLDER_UI.EDIT_BUTTON}>
            <Button
              type='text'
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
            />
          </Tooltip>
          <Tooltip title={STAKEHOLDER_UI.DELETE_BUTTON}>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                showDeleteConfirm({
                  title: STAKEHOLDER_UI.DELETE_TITLE,
                  content: STAKEHOLDER_UI.DELETE_CONFIRM,
                  onOk: () => onDelete(record.id),
                })
              }
              className='hover:bg-danger/10 flex size-9 items-center justify-center rounded-xl p-0 transition-all'
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className='premium-table-container'>
      <Table
        columns={columns}
        dataSource={stakeholders}
        rowKey='id'
        loading={{
          spinning: loading,
          indicator: <Spin size='large' />,
        }}
        pagination={false}
        scroll={{ x: 1000 }}
        className='premium-table'
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className='flex flex-col items-center gap-1'>
                  <span className='text-text font-bold'>{STAKEHOLDER_UI.EMPTY_TITLE}</span>
                  <span className='text-muted text-xs'>{STAKEHOLDER_UI.EMPTY_DESC}</span>
                </div>
              }
            />
          ),
        }}
      />
    </div>
  );
});

export default StakeholderList;
