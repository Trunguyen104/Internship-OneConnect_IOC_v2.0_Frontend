'use client';

import { Typography, Tag } from 'antd';
import { WarningOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function ViolationTable({ data, page, pageSize, sortOrder, onSort }) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {!data || data.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <p className='text-slate-400'>No violations recorded</p>
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='sticky top-0 z-10 border-b border-slate-200 bg-slate-50'>
                <tr>
                  <th className='w-[60px] px-6 py-4 text-xs font-semibold text-slate-500'>#</th>
                  <th className='w-[200px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Violation Type
                  </th>
                  <th className='w-[300px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Description
                  </th>
                  <th className='w-[180px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Violation Time
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Reporter
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    <div
                      className='flex cursor-pointer items-center gap-1 transition-colors hover:text-blue-600'
                      onClick={onSort}
                    >
                      Created Date
                      <div className='flex flex-col text-[10px]'>
                        <CaretUpOutlined
                          className={sortOrder === 'asc' ? 'text-blue-600' : 'text-slate-300'}
                        />
                        <CaretDownOutlined
                          className={sortOrder === 'desc' ? 'text-blue-600' : 'text-slate-300'}
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {data.map((record, index) => (
                  <tr key={record.id} className='transition-colors hover:bg-slate-50/80'>
                    <td className='px-6 py-4 text-sm text-slate-600'>
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      <span className='flex items-center gap-2 font-bold tracking-tight text-slate-800'>
                        <WarningOutlined className='text-amber-500' />
                        {record.type}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      <Text
                        className='text-sm text-slate-600 italic'
                        ellipsis={{ tooltip: record.description }}
                      >
                        {record.description}
                      </Text>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-xs font-medium text-slate-500'>
                        {dayjs(record.violationTime).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <Tag
                        color='cyan'
                        className='rounded-full border-none px-3 text-[10px] font-bold uppercase'
                      >
                        {record.reporter}
                      </Tag>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm font-bold text-slate-800'>
                        {dayjs(record.createdAt).format('DD/MM/YYYY')}
                      </span>
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
