'use client';

import React, { memo } from 'react';
import { Button, Tooltip, Empty } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined, CheckCircleOutlined, SyncOutlined, EyeOutlined } from '@ant-design/icons';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import IssueStatusTag from './IssueStatusTag';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

const IssueTable = memo(function IssueTable({
  issues,
  stakeholders,
  loading,
  page,
  pageSize,
  onToggleStatus,
  onDelete,
  onView,
}) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='border-muted h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-r-transparent'></div>
        </div>
      ) : !issues || issues.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <Empty description={ISSUE_UI.EMPTY.NO_DATA} />
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
                <tr>
                  <th className='text-muted w-[70px] px-6 py-5 text-xs font-semibold'>
                    {ISSUE_UI.TABLE.NO}
                  </th>
                  <th className='text-muted w-[300px] px-6 py-5 text-xs font-semibold'>
                    {ISSUE_UI.TABLE.TITLE}
                  </th>
                  <th className='text-muted w-[200px] px-6 py-5 text-xs font-semibold'>
                    {ISSUE_UI.TABLE.STAKEHOLDER}
                  </th>
                  <th className='text-muted w-[140px] px-6 py-5 text-xs font-semibold'>
                    {ISSUE_UI.TABLE.STATUS}
                  </th>
                  <th className='text-muted w-[160px] px-6 py-5 text-xs font-semibold'>
                    {ISSUE_UI.TABLE.CREATED_DATE}
                  </th>
                  <th className='text-muted px-6 py-5 text-right text-xs font-semibold'>
                    {ISSUE_UI.TABLE.ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-border/50 divide-y'>
                {issues.map((record, index) => {
                  const stakeholder = stakeholders.find((s) => s.id === record.stakeholderId);
                  return (
                    <tr key={record.id} className='hover:bg-bg/80 h-[72px] transition-colors'>
                      <td className='px-6 py-4'>
                        <span className='text-muted text-[13px] font-medium'>
                          {(page - 1) * pageSize + index + 1}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex min-w-0 flex-col'>
                          <span className='text-text block truncate text-[15px] font-bold'>
                            {record.title}
                          </span>
                          {record.description && (
                            <span className='text-muted block truncate text-[11px] font-medium'>
                              {record.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <span className='text-text text-sm font-medium'>
                            {stakeholder?.name || ISSUE_UI.EMPTY.UNKNOWN}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <IssueStatusTag status={record.status} />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <span className='text-text text-sm font-medium'>
                            {dayjs(record.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          <Tooltip
                            title={
                              record.status === 2 ? ISSUE_UI.BUTTON.REOPEN : ISSUE_UI.BUTTON.RESOLVE
                            }
                          >
                            <Button
                              type='text'
                              icon={
                                record.status === 2 ? <SyncOutlined /> : <CheckCircleOutlined />
                              }
                              onClick={() => onToggleStatus(record)}
                              className='text-muted hover:bg-primary-surface hover:text-primary flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                            />
                          </Tooltip>
                          <Tooltip title={ISSUE_UI.TABLE.VIEW_DETAIL}>
                            <Button
                              type='text'
                              icon={<EyeOutlined />}
                              onClick={() => onView(record.id)}
                              className='text-muted hover:bg-primary-surface hover:text-primary flex size-9 items-center justify-center rounded-xl p-0 transition-all'
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
                              className='hover:bg-danger-surface flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                            />
                          </Tooltip>
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
});

export default IssueTable;
