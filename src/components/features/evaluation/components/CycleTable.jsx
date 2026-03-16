'use client';

import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

const STATUS_CONFIG = {
  0: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning',
  },
  1: {
    label: EVALUATION_UI.STATUS.ONGOING,
    bg: 'bg-info-surface',
    text: 'text-info',
  },
  2: {
    label: EVALUATION_UI.STATUS.COMPLETED,
    bg: 'bg-success-surface',
    text: 'text-success',
  },
  ONGOING: {
    label: EVALUATION_UI.STATUS.ONGOING,
    bg: 'bg-info-surface',
    text: 'text-info',
  },
  UPCOMING: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning',
  },
  PENDING: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning',
  },
  COMPLETED: {
    label: EVALUATION_UI.STATUS.COMPLETED,
    bg: 'bg-success-surface',
    text: 'text-success',
  },
};

export default function CycleTable({ data, page, pageSize, onDetail }) {
  return (
    <div className='mt-5 flex min-h-0 flex-1 flex-col'>
      <div className='flex-1 overflow-auto'>
        <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
          <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
            <tr>
              <th className='text-muted w-[60px] px-6 py-4 text-xs font-semibold'>#</th>
              <th className='text-muted w-[280px] px-6 py-4 text-xs font-semibold'>
                Evaluation Cycle
              </th>
              <th className='text-muted w-[140px] px-6 py-4 text-xs font-semibold'>Start Date</th>
              <th className='text-muted w-[140px] px-6 py-4 text-xs font-semibold'>End Date</th>
              <th className='text-muted w-[150px] px-6 py-4 text-xs font-semibold'>Status</th>
              <th className='text-muted w-[120px] px-6 py-4 text-xs font-semibold'>Scored</th>
              <th className='text-muted w-[120px] px-6 py-4 text-right text-xs font-semibold'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-border/50 divide-y'>
            {data.map((record, index) => {
              const status = record.status;
              const normalized = status ? String(status).toUpperCase() : '';
              const cfg = STATUS_CONFIG[normalized] ||
                STATUS_CONFIG[status] || {
                  label: status || 'Unknown',
                  bg: 'bg-bg',
                  text: 'text-muted',
                  icon: null,
                };

              return (
                <tr key={record.cycleId} className='hover:bg-bg/80 transition-colors'>
                  <td className='text-muted px-6 py-4 text-sm'>
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-text font-bold tracking-tight'>{record.name}</span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-muted text-sm'>
                      {dayjs(record.startDate).format('DD/MM/YYYY')}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-muted text-sm'>
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
                    <span className='text-text font-bold'>
                      {record.totalStudentsScored ?? 0}
                      <span className='text-border mx-0.5 font-normal'>/</span>
                      {record.totalTeamStudents ?? 0}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Button
                      size='small'
                      icon={<EyeOutlined />}
                      onClick={() => onDetail(record)}
                      className='bg-primary shadow-primary/20 hover:!bg-primary/90 rounded-full border-none font-bold shadow-sm'
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
