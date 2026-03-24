'use client';

import { DeleteOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

import LogbookStatusTag from './LogbookStatusTag';

const LogbookTable = memo(function LogbookTable({ data, userProfile, onView, onEdit, onDelete }) {
  const currentStudentId = userProfile?.studentId;

  return (
    <div className="mt-5 flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
          <thead className="border-border bg-bg sticky top-0 z-10 border-b">
            <tr>
              <th className="text-muted w-[140px] px-6 py-5 text-xs font-semibold">
                {DAILY_REPORT_UI.TABLE.REPORT_DATE}
              </th>

              <th className="text-muted w-[200px] px-6 py-5 text-xs font-semibold">
                {DAILY_REPORT_UI.TABLE.STUDENT}
              </th>

              <th className="text-muted px-6 py-5 text-xs font-semibold">
                {DAILY_REPORT_UI.TABLE.SUMMARY}
              </th>

              <th className="text-muted px-6 py-5 text-xs font-semibold">
                {DAILY_REPORT_UI.TABLE.ISSUE}
              </th>

              <th className="text-muted w-[120px] px-6 py-5 text-center text-xs font-semibold">
                {DAILY_REPORT_UI.TABLE.STATUS}
              </th>

              <th className="text-muted w-[140px] px-6 py-5 text-center text-xs font-semibold">
                {DAILY_REPORT_UI.TABLE.ACTION}
              </th>
            </tr>
          </thead>

          <tbody className="divide-border/50 divide-y">
            {data.map((record) => {
              const isOwner = record.studentId === currentStudentId;

              return (
                <tr key={record.logbookId} className="hover:bg-bg/80 h-[72px] transition-colors">
                  <td className="text-text px-6 py-4 align-middle text-[15px]">
                    {record.dateReport
                      ? dayjs(record.dateReport).format(DAILY_REPORT_UI.DATE_FORMAT)
                      : DAILY_REPORT_UI.VIEW_MODAL.NA}
                  </td>

                  <td className="text-text px-6 py-4 align-middle text-[15px] font-bold whitespace-nowrap">
                    {record.studentName || DAILY_REPORT_UI.VIEW_MODAL.NA}
                  </td>

                  <td className="px-6 py-4 align-middle text-sm">
                    <Tooltip placement="topLeft" title={record.summary}>
                      <div className="text-muted max-w-[260px] truncate">{record.summary}</div>
                    </Tooltip>
                  </td>

                  <td className="px-6 py-4 align-middle text-sm">
                    <Tooltip placement="topLeft" title={record.issue}>
                      <div className="text-muted max-w-[220px] truncate">{record.issue || '-'}</div>
                    </Tooltip>
                  </td>

                  <td className="px-6 py-4 text-center align-middle">
                    <LogbookStatusTag status={record.status} />
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip title={DAILY_REPORT_UI.VIEW_MODAL.TITLE}>
                        <Button
                          type="text"
                          icon={<FileTextOutlined className="text-muted hover:text-info" />}
                          onClick={() => onView(record)}
                          className="hover:bg-info-surface flex h-8 w-8 items-center justify-center rounded-lg"
                        />
                      </Tooltip>

                      {isOwner && (
                        <>
                          <Tooltip title={DAILY_REPORT_UI.MODAL.EDIT_TITLE}>
                            <Button
                              type="text"
                              icon={<EditOutlined className="text-muted hover:text-warning" />}
                              onClick={() => onEdit(record)}
                              className="hover:bg-warning-surface flex h-8 w-8 items-center justify-center rounded-lg"
                            />
                          </Tooltip>

                          <Tooltip title={DAILY_REPORT_UI.DELETE_MODAL.TITLE}>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined className="text-muted hover:text-danger" />}
                              onClick={() =>
                                showDeleteConfirm({
                                  title: DAILY_REPORT_UI.DELETE_MODAL.TITLE,
                                  content: DAILY_REPORT_UI.DELETE_MODAL.CONTENT,
                                  onOk: () => onDelete(record.logbookId),
                                })
                              }
                              className="hover:bg-danger-surface flex h-8 w-8 items-center justify-center rounded-lg"
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
  );
});

export default LogbookTable;
