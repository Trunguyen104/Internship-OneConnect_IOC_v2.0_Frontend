'use client';

import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const STATUS_CONFIG = {
  0: {
    label: 'Pending',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  1: {
    label: 'Ongoing',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  2: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  ONGOING: {
    label: 'Ongoing',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  UPCOMING: {
    label: 'Pending',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
};

export default function CycleTable({ data, page, pageSize, onDetail }) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {!data || data.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <p className='text-slate-400'>No evaluation data</p>
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='sticky top-0 z-10 border-b border-slate-200 bg-slate-50'>
                <tr>
                  <th className='w-[60px] px-6 py-4 text-xs font-semibold text-slate-500'>#</th>
                  <th className='w-[280px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Evaluation Cycle
                  </th>
                  <th className='w-[140px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Start Date
                  </th>
                  <th className='w-[140px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    End Date
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Status
                  </th>
                  <th className='w-[120px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    Scored
                  </th>
                  <th className='w-[120px] px-6 py-4 text-right text-xs font-semibold text-slate-500'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {data.map((record, index) => {
                  const status = record.status;
                  const normalized = status ? String(status).toUpperCase() : '';
                  const cfg = STATUS_CONFIG[normalized] ||
                    STATUS_CONFIG[status] || {
                      label: status || 'Unknown',
                      bg: 'bg-slate-50',
                      text: 'text-slate-600',
                      icon: null,
                    };

                  return (
                    <tr key={record.cycleId} className='transition-colors hover:bg-slate-50/80'>
                      <td className='px-6 py-4 text-sm text-slate-600'>
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className='px-6 py-4'>
                        <span className='font-bold tracking-tight text-slate-800'>
                          {record.name}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-sm text-slate-600'>
                          {dayjs(record.startDate).format('DD/MM/YYYY')}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-sm text-slate-600'>
                          {dayjs(record.endDate).format('DD/MM/YYYY')}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='font-bold text-slate-700'>
                          {record.totalStudentsScored ?? 0}
                          <span className='mx-0.5 font-normal text-slate-300'>/</span>
                          {record.totalTeamStudents ?? 0}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <Button
                          size='small'
                          icon={<EyeOutlined />}
                          onClick={() => onDetail(record)}
                          className='rounded-full border-none bg-[#d52020] font-bold shadow-sm shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
                        />
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
