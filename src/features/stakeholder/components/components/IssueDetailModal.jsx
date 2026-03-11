'use client';

import dayjs from 'dayjs';
import { CloseOutlined } from '@ant-design/icons';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

export default function IssueDetailModal({ issue, onClose }) {
  if (!issue) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-2xl'>
        <div className='flex items-center justify-between border-b px-6 py-4'>
          <h2 className='text-lg font-semibold'>{ISSUE_UI.DETAIL.TITLE}</h2>
          <button onClick={onClose} className='rounded-full p-2 hover:bg-slate-100'>
            <CloseOutlined />
          </button>
        </div>

        <div className='space-y-4 px-6 py-5 text-sm'>
          <div>
            <p className='text-slate-500'>{ISSUE_UI.TABLE.TITLE}</p>
            <p className='font-medium'>{issue.title}</p>
          </div>

          <div>
            <p className='text-slate-500'>{ISSUE_UI.TABLE.DESCRIPTION}</p>
            <p>{issue.description || '-'}</p>
          </div>

          <div>
            <p className='text-slate-500'>{ISSUE_UI.TABLE.STAKEHOLDER}</p>
            <p>{issue.stakeholderName || '-'}</p>
          </div>

          <div>
            <p className='text-slate-500'>{ISSUE_UI.TABLE.STATUS}</p>
            <p>{issue.status}</p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-slate-500'>{ISSUE_UI.DETAIL.CREATED_AT}</p>
              <p>{dayjs(issue.createdAt).format('DD/MM/YYYY')}</p>
            </div>

            <div>
              <p className='text-slate-500'>{ISSUE_UI.DETAIL.RESOLVED_AT}</p>
              <p>{issue.resolvedAt ? dayjs(issue.resolvedAt).format('DD/MM/YYYY') : '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

