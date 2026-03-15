import React, { memo } from 'react';
import { Table, Button, Tag, Avatar, Tooltip, Empty, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';

const StakeholderList = memo(function StakeholderList({
  stakeholders,
  loading,
  page = 1,
  pageSize = 10,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: STAKEHOLDER_UI.TABLE_NO,
      key: 'no',
      width: 80,
      align: 'center',
      render: (_, __, index) => (
        <span className='text-muted text-xs font-semibold'>
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_NAME,
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className='flex items-center gap-3'>
          <div className='flex flex-col'>
            <span className='text-text text-sm leading-tight font-bold'>{name}</span>
            {record.description && (
              <span className='text-muted mt-0.5 line-clamp-1 text-xs'>{record.description}</span>
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
        <span className='text-primary text-[10px] font-bold tracking-widest uppercase'>
          {role || STAKEHOLDER_UI.NO_ROLE}
        </span>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_EMAIL,
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <div className='flex items-center gap-2'>
          <span className='text-text text-sm font-medium'>{email}</span>
        </div>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_PHONE,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone) => (
        <div className='flex items-center gap-2'>
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
