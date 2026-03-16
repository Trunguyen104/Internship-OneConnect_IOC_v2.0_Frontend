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
          <p className='text-muted'>No violations recorded</p>
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
                <tr>
                  <th className='text-muted w-[60px] px-6 py-5 text-xs font-semibold'>#</th>
                  <th className='text-muted w-[200px] px-6 py-5 text-xs font-semibold'>
                    Violation Type
                  </th>
                  <th className='text-muted w-[300px] px-6 py-5 text-xs font-semibold'>
                    Description
                  </th>
                  <th className='text-muted w-[180px] px-6 py-5 text-xs font-semibold'>
                    Violation Time
                  </th>
                  <th className='text-muted w-[150px] px-6 py-5 text-xs font-semibold'>Reporter</th>
                  <th className='text-muted w-[150px] px-6 py-5 text-xs font-semibold'>
                    <div
                      className='hover:text-info flex cursor-pointer items-center gap-1 transition-colors'
                      onClick={onSort}
                    >
                      Created Date
                      <div className='flex flex-col text-[10px]'>
                        <CaretUpOutlined
                          className={sortOrder === 'asc' ? 'text-info' : 'text-border'}
                        />
                        <CaretDownOutlined
                          className={sortOrder === 'desc' ? 'text-info' : 'text-border'}
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-border/50 divide-y'>
                {data.map((record, index) => (
                  <tr key={record.id} className='hover:bg-bg/80 h-[72px] transition-colors'>
                    <td className='text-muted px-6 py-4 text-sm font-semibold'>
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      <span className='text-text flex items-center gap-2 text-[15px] font-bold tracking-tight'>
                        <WarningOutlined className='text-warning' />
                        {record.type}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      <Text
                        className='text-muted text-sm italic'
                        ellipsis={{ tooltip: record.description }}
                      >
                        {record.description}
                      </Text>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-muted text-xs font-medium'>
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
                      <span className='text-text text-sm font-bold'>
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
