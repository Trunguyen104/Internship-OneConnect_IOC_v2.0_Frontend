'use client';

import { Modal } from 'antd';
import dayjs from 'dayjs';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

// const { Text } = Typography;

export default function LogbookDetailModal({ visible, record, onClose }) {
  const renderStatus = (status) => {
    const config = {
      PUNCTUAL: {
        label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
        style: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      },
      LATE: {
        label: DAILY_REPORT_UI.STATUS.LATE,
        style: 'bg-red-50 text-red-600 border-red-200',
      },
      UNKNOWN: {
        label: DAILY_REPORT_UI.STATUS.UNKNOWN,
        style: 'bg-gray-50 text-gray-600 border-gray-200',
      },
    };

    const c = config[status] || config.UNKNOWN;

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${c.style}`}
      >
        {c.label}
      </span>
    );
  };

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
              {renderStatus(record.status)}
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
        </div>
      )}
    </Modal>
  );
}
