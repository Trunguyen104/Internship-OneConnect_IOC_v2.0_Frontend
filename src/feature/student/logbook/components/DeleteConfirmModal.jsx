'use client';

import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

export default function DeleteConfirmModal({ open, onCancel, onConfirm, loading }) {
  return (
    <Modal open={open} footer={null} centered width={420} onCancel={onCancel} destroyOnHidden>
      <div className='flex flex-col items-center py-4 text-center'>
        <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600'>
          <ExclamationCircleOutlined className='text-2xl' />
        </div>

        <h3 className='mb-1 text-lg font-semibold text-gray-900'>
          {DAILY_REPORT_UI.DELETE_MODAL.TITLE}
        </h3>

        <p className='mb-6 text-sm text-gray-500'>{DAILY_REPORT_UI.DELETE_MODAL.CONTENT}</p>

        <div className='flex gap-3'>
          <Button onClick={onCancel} className='h-10 rounded-lg px-6'>
            {DAILY_REPORT_UI.DELETE_MODAL.CANCEL}
          </Button>

          <Button
            danger
            type='primary'
            loading={loading}
            onClick={onConfirm}
            className='h-10 rounded-lg px-6'
          >
            {DAILY_REPORT_UI.DELETE_MODAL.CONFIRM}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
