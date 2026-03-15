'use client';

import React, { memo } from 'react';
import { Table, Typography, Tooltip, Button, Avatar } from 'antd';
import {
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import LogbookStatusTag from './LogbookStatusTag';

const { Text } = Typography;

const LogbookTable = memo(function LogbookTable({
  data,
  loading,
  userProfile,
  onView,
  onEdit,
  onDelete,
  onTableChange,
}) {
  const currentStudentId = userProfile?.studentId;

  const columns = [
    {
      title: <span className='tracking-wider'>{DAILY_REPORT_UI.TABLE.REPORT_DATE}</span>,
      dataIndex: 'dateReport',
      key: 'dateReport',
      sorter: true,
      width: 160,
      render: (text) => (
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 flex size-9 items-center justify-center rounded-xl'>
            <CalendarOutlined className='text-primary text-lg' />
          </div>
          <span className='text-text text-sm font-bold tracking-tight'>
            {text ? new Date(text).toLocaleDateString('vi-VN') : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      title: DAILY_REPORT_UI.TABLE.STUDENT,
      dataIndex: 'studentName',
      key: 'studentName',
      width: 220,
      render: (text) => (
        <div className='flex items-center gap-3'>
          <Avatar
            size={36}
            className='bg-primary/10 text-primary border-surface border-2 text-[10px] font-bold shadow-sm'
          >
            {text?.[0].toUpperCase()}
          </Avatar>
          <span className='text-text text-sm font-bold'>{text || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: DAILY_REPORT_UI.TABLE.SUMMARY,
      dataIndex: 'summary',
      key: 'summary',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip placement='topLeft' title={text}>
          <span className='text-text text-xs leading-relaxed'>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: DAILY_REPORT_UI.TABLE.ISSUE,
      dataIndex: 'issue',
      key: 'issue',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip placement='topLeft' title={text}>
          <span className='text-muted text-xs italic'>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: DAILY_REPORT_UI.TABLE.STATUS,
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status) => <LogbookStatusTag status={status} />,
    },
    {
      title: <span className='pr-4'>{DAILY_REPORT_UI.TABLE.ACTION}</span>,
      key: 'action',
      width: 140,
      align: 'right',
      render: (_, record) => {
        const isOwner = record.studentId === currentStudentId;

        return (
          <div className='flex items-center justify-end gap-1'>
            <Tooltip title='Xem chi tiết'>
              <Button
                type='text'
                icon={<FileTextOutlined />}
                onClick={() => onView(record)}
                className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
              />
            </Tooltip>

            {isOwner && (
              <>
                <Tooltip title='Chỉnh sửa báo cáo'>
                  <Button
                    type='text'
                    icon={<EditOutlined />}
                    onClick={() => onEdit(record)}
                    className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                  />
                </Tooltip>

                <Tooltip title='Xóa báo cáo'>
                  <Button
                    type='text'
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      showDeleteConfirm({
                        title: DAILY_REPORT_UI.DELETE_MODAL.TITLE,
                        content: DAILY_REPORT_UI.DELETE_MODAL.CONTENT,
                        onOk: () => onDelete(record.logbookId),
                      })
                    }
                    className='hover:bg-danger/10 flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                  />
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className='flex-1 overflow-hidden px-2'>
      <Table
        columns={columns}
        dataSource={data}
        rowKey='logbookId'
        loading={loading}
        onChange={onTableChange}
        pagination={false}
        className='premium-table'
        rowClassName='group hover:bg-muted/5 transition-all duration-200 cursor-default'
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: (
            <div className='py-12 text-center'>
              <Text className='text-muted italic'>{DAILY_REPORT_UI.EMPTY.NO_LOGBOOK}</Text>
            </div>
          ),
        }}
      />
    </div>
  );
});

export default LogbookTable;
