'use client';

import React from 'react';
import { Typography, Tooltip, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import StudentStatusTag from './StudentStatusTag';
import StudentRoleTag from './StudentRoleTag';
import StudentAvatar from './StudentAvatar';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
const { Text } = Typography;

export default function StudentTable({ data, loading, onDelete }) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-slate-400 border-r-transparent'></div>
        </div>
      ) : data?.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <p className='text-slate-400'>{STUDENT_LIST_UI.EMPTY.NO_MEMBERS}</p>
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='sticky top-0 z-10 border-b border-slate-200 bg-slate-50'>
                <tr>
                  <th className='w-[60px] px-6 py-4 text-xs font-semibold text-slate-500'>#</th>
                  <th className='w-[300px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STUDENT_LIST_UI.TABLE.STUDENT}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STUDENT_LIST_UI.TABLE.CODE}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STUDENT_LIST_UI.TABLE.ROLE}
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STUDENT_LIST_UI.TABLE.STATUS}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STUDENT_LIST_UI.TABLE.JOINED_AT}
                  </th>
                  <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {data?.map((record, index) => (
                  <tr key={record.studentId} className='transition-colors hover:bg-slate-50/80'>
                    <td className='px-6 py-4 text-sm text-slate-600'>{index + 1}</td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <StudentAvatar name={record.fullName} />
                        <div className='flex flex-col'>
                          <span className='text-[15px] font-semibold text-slate-800'>
                            {record.fullName || STUDENT_LIST_UI.DEFAULT.NA}
                          </span>
                          <span className='text-[13px] text-slate-500'>{record.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='font-medium text-slate-600'>{record.studentCode}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <StudentRoleTag role={record.role} />
                    </td>
                    <td className='px-6 py-4'>
                      <StudentStatusTag status={record.status} />
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-slate-600'>
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
                          className='rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500'
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
