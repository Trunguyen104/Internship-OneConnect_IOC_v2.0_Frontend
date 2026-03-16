'use client';

import React from 'react';
import { Typography, Tooltip, Button, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import StudentStatusTag from './StudentStatusTag';
import StudentRoleTag from './StudentRoleTag';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
const { Text } = Typography;

export default function StudentTable({ data, loading, onDelete }) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='border-muted h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-r-transparent'></div>
        </div>
      ) : data?.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <Empty description={STUDENT_LIST_UI.EMPTY.NO_MEMBERS} />
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
                <tr>
                  <th className='text-muted w-[60px] px-6 py-5 text-xs font-semibold'>#</th>
                  <th className='text-muted w-[300px] px-6 py-5 text-xs font-semibold'>
                    {STUDENT_LIST_UI.TABLE.STUDENT}
                  </th>
                  <th className='text-muted px-6 py-5 text-xs font-semibold'>
                    {STUDENT_LIST_UI.TABLE.CODE}
                  </th>
                  <th className='text-muted px-6 py-5 text-xs font-semibold'>
                    {STUDENT_LIST_UI.TABLE.ROLE}
                  </th>
                  <th className='text-muted w-[150px] px-6 py-5 text-xs font-semibold'>
                    {STUDENT_LIST_UI.TABLE.STATUS}
                  </th>
                  <th className='text-muted px-6 py-5 text-xs font-semibold'>
                    {STUDENT_LIST_UI.TABLE.JOINED_AT}
                  </th>
                  <th className='text-muted px-6 py-5 text-right text-xs font-semibold'></th>
                </tr>
              </thead>
              <tbody className='divide-border/50 divide-y'>
                {data?.map((record, index) => (
                  <tr key={record.studentId} className='hover:bg-bg/80 h-[72px] transition-colors'>
                    <td className='text-muted px-6 py-4 text-sm font-semibold'>{index + 1}</td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                          <span className='text-text text-[15px] font-bold tracking-tight'>
                            {record.fullName || STUDENT_LIST_UI.DEFAULT.NA}
                          </span>
                          <span className='text-muted text-[11px] font-medium tracking-wider uppercase'>
                            {record.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-muted text-sm font-semibold tracking-tight'>
                        {record.studentCode}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <StudentRoleTag role={record.role} />
                    </td>
                    <td className='px-6 py-4'>
                      <StudentStatusTag status={record.status} />
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-text text-sm font-bold'>
                        {record.joinedAt
                          ? new Date(record.joinedAt).toLocaleDateString('en-GB')
                          : STUDENT_LIST_UI.DEFAULT.NA}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <Tooltip title={STUDENT_LIST_UI.ACTION.REMOVE_STUDENT}>
                        <Button
                          danger
                          type='text'
                          icon={<DeleteOutlined />}
                          className='text-muted hover:bg-danger-surface hover:text-danger rounded-lg transition-colors'
                          onClick={() =>
                            showDeleteConfirm({
                              title: STUDENT_LIST_UI.CONFIRM.REMOVE_TITLE,
                              content: STUDENT_LIST_UI.CONFIRM.REMOVE_DESC,
                              onOk: () => onDelete(record.studentId),
                            })
                          }
                        />
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
