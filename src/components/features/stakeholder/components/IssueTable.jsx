'use client';

import React, { memo } from 'react';
import { Table, Button, Tooltip, Empty, Spin, Avatar } from 'antd';
import dayjs from 'dayjs';
import {
  DeleteOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import IssueStatusTag from './IssueStatusTag';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';
import { ISSUE_STATUS } from '../constants/issueStatus';

const IssueTable = memo(function IssueTable({
  issues,
  stakeholders,
  loading,
  page,
  pageSize,
  onToggleStatus,
  onDelete,
  onView,
  tableBodyRef,
}) {
  const columns = [
    {
      title: ISSUE_UI.TABLE.NO,
      key: 'index',
      width: 70,
      render: (_, __, index) => (
        <span className='text-muted font-medium'>{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      title: ISSUE_UI.TABLE.TITLE,
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div className='flex min-w-0 flex-col'>
          <span className='text-text block truncate text-[15px] font-bold'>{title}</span>
          {record.description && (
            <span className='text-muted block truncate text-[11px] font-medium'>
              {record.description}
            </span>
          )}
        </div>
      ),
    },
    {
      title: ISSUE_UI.TABLE.STAKEHOLDER,
      dataIndex: 'stakeholderId',
      key: 'stakeholder',
      width: 200,
      render: (stakeholderId) => {
        const stakeholder = stakeholders.find((s) => s.id === stakeholderId);
        return (
          <div className='flex items-center gap-2'>
            <Avatar
              size='small'
              icon={<UserOutlined />}
              className='bg-primary/10 text-primary border-none'
            />
            <span className='text-text text-sm font-medium'>
              {stakeholder?.name || ISSUE_UI.EMPTY.UNKNOWN}
            </span>
          </div>
        );
      },
    },
    {
      title: ISSUE_UI.TABLE.STATUS,
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => <IssueStatusTag status={status} />,
    },
    {
      title: ISSUE_UI.TABLE.CREATED_DATE,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => (
        <div className='flex items-center gap-2'>
          <ClockCircleOutlined className='text-muted text-xs' />
          <span className='text-text text-sm font-medium'>{dayjs(date).format('DD/MM/YYYY')}</span>
        </div>
      ),
    },
    {
      title: ISSUE_UI.TABLE.ACTIONS,
      key: 'actions',
      fixed: 'right',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div className='flex items-center justify-end gap-1'>
          <Tooltip title={record.status === 2 ? ISSUE_UI.BUTTON.REOPEN : ISSUE_UI.BUTTON.RESOLVE}>
            <Button
              type='text'
              icon={record.status === 2 ? <SyncOutlined /> : <CheckCircleOutlined />}
              onClick={() => onToggleStatus(record)}
              className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
            />
          </Tooltip>
          <Tooltip title={ISSUE_UI.TABLE.VIEW_DETAIL}>
            <Button
              type='text'
              icon={<EyeOutlined />}
              onClick={() => onView(record.id)}
              className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
            />
          </Tooltip>
          <Tooltip title={ISSUE_UI.BUTTON.DELETE}>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                showDeleteConfirm({
                  title: ISSUE_UI.BUTTON.DELETE,
                  content: ISSUE_UI.TABLE.DELETE_CONFIRM,
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
        dataSource={issues}
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
                  <span className='text-text font-bold'>{ISSUE_UI.EMPTY.NO_DATA}</span>
                </div>
              }
            />
          ),
        }}
      />
    </div>
  );
});

export default IssueTable;
