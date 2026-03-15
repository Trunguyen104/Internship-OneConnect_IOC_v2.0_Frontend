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

export default function StakeholderList({
  stakeholders,
  loading,
  page = 1,
  pageSize = 10,
  onEdit,
  onDelete,
}) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-slate-400 border-r-transparent'></div>
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
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='sticky top-0 z-10 border-b border-slate-200 bg-slate-50'>
                <tr>
                  <th className='w-[60px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.TABLE_NO}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_NAME}
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_ROLE}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_EMAIL}
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_PHONE}
                  </th>
                  <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {stakeholders.map((s, index) => (
                  <tr key={s.id} className='transition-colors hover:bg-slate-50/80'>
                    <td className='px-6 py-4 text-sm text-slate-600'>
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='min-w-0'>
                          <div
                            className='truncate text-sm font-medium text-slate-800'
                            title={s.name}
                          >
                            {s.name}
                          </div>
                          {s.description && (
                            <div
                              className='max-w-[200px] truncate text-xs text-slate-400'
                              title={s.description}
                            >
                              {s.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-blue-600'>
                        {s.role || STAKEHOLDER_UI.NO_ROLE}
                      </span>
                    </td>
                    <td className='truncate px-6 py-4 text-sm text-slate-600' title={s.email}>
                      {s.email}
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600'>{s.phoneNumber || '—'}</td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => onEdit(s)}
                          className='px-2 text-slate-400 transition-colors hover:text-blue-600'
                          title={STAKEHOLDER_UI.EDIT_BUTTON}
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() =>
                            showDeleteConfirm({
                              title: STAKEHOLDER_UI.DELETE_TITLE,
                              content: STAKEHOLDER_UI.DELETE_CONFIRM,
                              onOk: () => onDelete(s.id),
                            })
                          }
                          className='px-2 text-slate-400 transition-colors hover:text-red-600'
                          title={STAKEHOLDER_UI.DELETE_BUTTON}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
