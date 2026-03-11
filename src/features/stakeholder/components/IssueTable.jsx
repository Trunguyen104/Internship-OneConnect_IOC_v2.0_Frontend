'use client';

import dayjs from 'dayjs';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import IssueStatusTag from './ui/IssueStatusTag';

import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

export const ISSUE_STATUS = {
  OPEN: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
  CLOSED: 3,
};

export const ISSUE_STATUS_LABEL = {
  0: 'Open',
  1: 'In Progress',
  2: 'Resolved',
  3: 'Closed',
};

export default function IssueTable({
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
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-slate-400 border-r-transparent'></div>
        </div>
      ) : issues.length === 0 ? (
        <div className='flex flex-1 items-center justify-center'>
          <p className='text-slate-400'>{ISSUE_UI.EMPTY.NO_DATA}</p>
        </div>
      ) : (
        <>
          <div className='mt-5 flex min-h-0 flex-1 flex-col'>
            <div className='flex-1 overflow-auto' ref={tableBodyRef}>
              <table className='w-full min-w-[900px] table-fixed border-collapse text-left'>
                <thead className='sticky top-0 z-10 border-b border-slate-200 bg-slate-50'>
                  <tr>
                    <th className='w-[60px] px-6 py-4 text-xs font-semibold text-slate-500'>
                      {ISSUE_UI.TABLE.NO}
                    </th>
                    <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                      {ISSUE_UI.TABLE.TITLE}
                    </th>
                    <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                      {ISSUE_UI.TABLE.STAKEHOLDER}
                    </th>
                    <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                      {ISSUE_UI.TABLE.DESCRIPTION}
                    </th>
                    <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                      {ISSUE_UI.TABLE.STATUS}
                    </th>
                    <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                      {ISSUE_UI.TABLE.CREATED_DATE}
                    </th>
                    <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500'>
                      {ISSUE_UI.TABLE.ACTIONS}
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {issues.map((i, index) => (
                    <tr
                      key={i.id}
                      onClick={() => onView(i.id)}
                      className='cursor-pointer transition-colors hover:bg-slate-50/80'
                    >
                      <td className='px-6 py-4 text-sm text-slate-600'>
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-600'>{i.title}</td>
                      <td className='truncate px-6 py-4 text-sm text-slate-600'>
                        {stakeholders.find((s) => s.id === i.stakeholderId)?.name ||
                          ISSUE_UI.EMPTY.UNKNOWN}
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-600'>
                        <div className='max-w-[300px] truncate' title={i.description}>
                          {i.description || '-'}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <IssueStatusTag status={i.status} />
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-600'>
                        {dayjs(i.createdAt).format('DD/MM/YYYY')}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(i);
                            }}
                            className='px-2 text-slate-400 hover:text-blue-600'
                          >
                            {i.status === 2 ? ISSUE_UI.BUTTON.REOPEN : ISSUE_UI.BUTTON.RESOLVE}
                          </button>
                          <Popconfirm
                            title={ISSUE_UI.BUTTON.DELETE}
                            onConfirm={(e) => {
                              e?.stopPropagation();
                              onDelete(i.id);
                            }}
                          >
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className='px-2 text-slate-400 hover:text-red-600'
                            >
                              <DeleteOutlined />
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
