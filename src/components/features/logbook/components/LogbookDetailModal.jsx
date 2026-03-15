'use client';

import { Modal } from 'antd';
import dayjs from 'dayjs';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import LogbookStatusTag from './LogbookStatusTag';

// const { Text } = Typography;

export default function LogbookDetailModal({ visible, record, onClose }) {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnHidden
      title={
        <div className='flex items-center gap-3 border-b border-gray-100 pb-3'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              {DAILY_REPORT_UI.VIEW_MODAL.TITLE}
            </h3>
            <p className='text-sm text-gray-500'>
              {record ? dayjs(record.dateReport).format('DD/MM/YYYY') : ''}
            </p>
          </div>
        </div>
      }
    >
      {record && (
        <div className='mt-4 max-h-[60vh] space-y-6 overflow-y-auto pr-2'>
          <div className='grid grid-cols-2 gap-6 border-b border-gray-100 pb-4'>
            <div>
              <p className='text-sm font-medium text-gray-500'>{DAILY_REPORT_UI.TABLE.STUDENT}</p>
              <p className='text-base font-semibold text-gray-900'>{record.studentName || 'N/A'}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>{DAILY_REPORT_UI.TABLE.STATUS}</p>
              <LogbookStatusTag status={record.status} />
            </div>
          </div>

          <section className='space-y-2'>
            <h4 className='font-semibold text-gray-800'>{DAILY_REPORT_UI.FORM.SUMMARY}</h4>

            <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-700'>
              {record.summary || DAILY_REPORT_UI.VIEW_MODAL.NO_SUMMARY}
            </div>
          </section>

          <section className='space-y-2'>
            <h4 className='font-semibold text-gray-800'>{DAILY_REPORT_UI.FORM.ISSUE}</h4>

            <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-700'>
              {record.issue || 'No issues reported.'}
            </div>
          </section>

          <section className='space-y-2'>
            <h4 className='font-semibold text-gray-800'>{DAILY_REPORT_UI.FORM.PLAN}</h4>

            <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-700'>
              {record.plan || 'No plan outlined.'}
            </div>
          </section>

          {record.workItems?.length > 0 && (
            <section className='space-y-3'>
              <h4 className='font-semibold text-gray-800'>Linked Work Items</h4>
              <div className='space-y-2'>
                {record.workItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center gap-3 rounded-lg border border-slate-100 p-3'
                  >
                    <div className='h-2 w-2 rounded-full bg-blue-500' />
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-slate-800'>{item.title}</p>
                      <p className='line-clamp-1 text-xs text-slate-500'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}
