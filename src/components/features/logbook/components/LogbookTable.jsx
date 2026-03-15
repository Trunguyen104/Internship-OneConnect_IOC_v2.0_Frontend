'use client';

import { Tooltip, Button } from 'antd';
import { FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import dayjs from 'dayjs';
import LogbookStatusTag from './LogbookStatusTag';

export default function LogbookTable({ data, loading, userProfile, onView, onEdit, onDelete }) {
  const currentStudentId = userProfile?.studentId;

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-slate-400 border-r-transparent'></div>
        </div>
      ) : data?.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <p className='text-slate-400'>{DAILY_REPORT_UI.EMPTY.NO_LOGBOOK}</p>
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='sticky top-0 z-10 border-b border-slate-200 bg-slate-50'>
                <tr>
                  <th className='w-[140px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {DAILY_REPORT_UI.TABLE.REPORT_DATE}
                  </th>
                  <th className='w-[180px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {DAILY_REPORT_UI.TABLE.STUDENT}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {DAILY_REPORT_UI.TABLE.SUMMARY}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {DAILY_REPORT_UI.TABLE.ISSUE}
                  </th>
                  <th className='w-[120px] px-6 py-4 text-center text-xs font-semibold text-slate-500'>
                    {DAILY_REPORT_UI.TABLE.STATUS}
                  </th>
                  <th className='w-[140px] px-6 py-4 text-center text-xs font-semibold text-slate-500'>
                    {DAILY_REPORT_UI.TABLE.ACTION}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {data?.map((record) => {
                  const isOwner = record.studentId === currentStudentId;

                  return (
                    <tr key={record.logbookId} className='transition-colors hover:bg-slate-50/80'>
                      <td className='px-6 py-4 text-sm'>
                        <span className='font-bold tracking-tight text-slate-800'>
                          {record.dateReport
                            ? dayjs(record.dateReport).format('DD/MM/YYYY')
                            : 'N/A'}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm whitespace-nowrap'>
                        <span className='font-semibold text-slate-700'>
                          {record.studentName || 'N/A'}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <Tooltip placement='topLeft' title={record.summary}>
                          <div className='truncate text-slate-600'>{record.summary}</div>
                        </Tooltip>
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <Tooltip placement='topLeft' title={record.issue}>
                          <div className='truncate text-slate-500 italic'>
                            {record.issue || '-'}
                          </div>
                        </Tooltip>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <LogbookStatusTag status={record.status} />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center justify-center gap-2'>
                          <Tooltip title='View Details'>
                            <Button
                              type='text'
                              icon={
                                <FileTextOutlined className='text-gray-500 hover:text-blue-600' />
                              }
                              onClick={() => onView(record)}
                              className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-50'
                            />
                          </Tooltip>

                          {isOwner && (
                            <>
                              <Tooltip title='Edit Report'>
                                <Button
                                  type='text'
                                  icon={
                                    <EditOutlined className='text-gray-500 hover:text-amber-500' />
                                  }
                                  onClick={() => onEdit(record)}
                                  className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-amber-50'
                                />
                              </Tooltip>

                              <Tooltip title='Delete Report'>
                                <Button
                                  type='text'
                                  danger
                                  icon={
                                    <DeleteOutlined className='text-gray-400 hover:text-red-500' />
                                  }
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
