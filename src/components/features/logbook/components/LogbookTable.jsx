'use client';

import AppTable from '@/components/ui/AppTable';
import { Typography, Tooltip, Button } from 'antd';
import { FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import LogbookStatusTag from './LogbookStatusTag';

const { Text } = Typography;

export default function LogbookTable({
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
      title: DAILY_REPORT_UI.TABLE.REPORT_DATE,
      dataIndex: 'dateReport',
      key: 'dateReport',
      sorter: true,
      width: 140,
      render: (text) => (
        <span className='font-bold tracking-tight text-slate-800'>
          {text ? new Date(text).toLocaleDateString('en-GB') : 'N/A'}
        </span>
      ),
    },
    {
      title: DAILY_REPORT_UI.TABLE.STUDENT,
      dataIndex: 'studentName',
      key: 'studentName',
      width: 180,
      render: (text) => <Text className='font-semibold text-slate-700'>{text || 'N/A'}</Text>,
    },
    {
      title: DAILY_REPORT_UI.TABLE.SUMMARY,
      dataIndex: 'summary',
      key: 'summary',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip placement='topLeft' title={text}>
          <span className='text-sm text-slate-600'>{text}</span>
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
          <span className='text-sm text-slate-500 italic'>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: DAILY_REPORT_UI.TABLE.STATUS,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => <LogbookStatusTag status={status} />,
    },
    {
      title: DAILY_REPORT_UI.TABLE.ACTION,
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const isOwner = record.studentId === currentStudentId;

        return (
          <div className='flex items-center justify-center gap-2'>
            <Tooltip title='View Details'>
              <Button
                type='text'
                icon={<FileTextOutlined className='text-gray-500 hover:text-blue-600' />}
                onClick={() => onView(record)}
                className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-50'
              />
            </Tooltip>

            {isOwner && (
              <>
                <Tooltip title='Edit Report'>
                  <Button
                    type='text'
                    icon={<EditOutlined className='text-gray-500 hover:text-amber-500' />}
                    onClick={() => onEdit(record)}
                    className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-amber-50'
                  />
                </Tooltip>

                <Tooltip title='Delete Report'>
                  <Button
                    type='text'
                    danger
                    icon={<DeleteOutlined className='text-gray-400 hover:text-red-500' />}
                    onClick={() =>
                      showDeleteConfirm({
                        title: DAILY_REPORT_UI.DELETE_MODAL.TITLE,
                        content: DAILY_REPORT_UI.DELETE_MODAL.CONTENT,
                        onOk: () => onDelete(record.logbookId),
                      })
                    }
                    className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50'
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
    <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm'>
      <AppTable
        columns={columns}
        data={data}
        rowKey='logbookId'
        loading={loading}
        onChange={onTableChange}
        pagination={false}
        scroll={{ x: 'max-content', y: 'calc(100vh - 420px)' }}
        emptyText={DAILY_REPORT_UI.EMPTY.NO_LOGBOOK}
      />
    </div>
  );
}
