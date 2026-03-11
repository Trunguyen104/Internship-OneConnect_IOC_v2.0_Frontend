'use client';

import AppTable from '@/shared/components/AppTable';
import { Typography, Tooltip, Button } from 'antd';
import { FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

const { Text } = Typography;

export default function LogbookTable({ data, loading, onView, onEdit, onDelete, onTableChange }) {
  const renderStatus = (status) => {
    const config = {
      0: {
        label: DAILY_REPORT_UI.STATUS.SUBMITTED,
        style: 'bg-blue-50 text-blue-600 border-blue-200 border',
      },
      SUBMITTED: {
        label: DAILY_REPORT_UI.STATUS.SUBMITTED,
        style: 'bg-blue-50 text-blue-600 border-blue-200 border',
      },
      PUNCTUAL: {
        label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
        style: 'bg-emerald-50 text-emerald-600 border-emerald-200 border',
      },
      3: {
        label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
        style: 'bg-emerald-50 text-emerald-600 border-emerald-200 border',
      },
      LATE: {
        label: DAILY_REPORT_UI.STATUS.LATE,
        style: 'bg-red-50 text-red-600 border-red-200 border',
      },
      4: {
        label: DAILY_REPORT_UI.STATUS.LATE,
        style: 'bg-red-50 text-red-600 border-red-200 border',
      },
      UNKNOWN: {
        label: DAILY_REPORT_UI.STATUS.UNKNOWN,
        style: 'bg-gray-50 text-gray-600 border-gray-200 border',
      },
    };

    const c = config[status] || config.UNKNOWN;

    return (
      <div className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${c.style}`}>
        {c.label}
      </div>
    );
  };
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
  });
  const handleConfirmDelete = () => {
    onDelete(deleteModal.id);
    setDeleteModal({ open: false, id: null });
  };
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
      render: (status) => renderStatus(status),
    },
    {
      title: DAILY_REPORT_UI.TABLE.ACTION,
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-2'>
          <Tooltip title='View Details'>
            <Button
              type='text'
              icon={<FileTextOutlined className='text-gray-500 hover:text-blue-600' />}
              onClick={() => onView(record)}
              className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-50'
            />
          </Tooltip>

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
                setDeleteModal({
                  open: true,
                  id: record.logbookId,
                })
              }
              className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50'
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
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
      <DeleteConfirmModal
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
