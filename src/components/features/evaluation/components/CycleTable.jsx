'use client';

import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

const STATUS_CONFIG = {
  0: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning-text',
    border: 'border-warning-border',
  },
  1: {
    label: EVALUATION_UI.STATUS.ONGOING,
    bg: 'bg-info-surface',
    text: 'text-info',
    border: 'border-info/20',
  },
  2: {
    label: EVALUATION_UI.STATUS.COMPLETED,
    bg: 'bg-success-surface',
    text: 'text-success',
    border: 'border-success/20',
  },
  ONGOING: {
    label: EVALUATION_UI.STATUS.ONGOING,
    bg: 'bg-info-surface',
    text: 'text-info',
    border: 'border-info/20',
  },
  UPCOMING: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning-text',
    border: 'border-warning-border',
  },
  PENDING: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning-text',
    border: 'border-warning-border',
  },
  COMPLETED: {
    label: EVALUATION_UI.STATUS.COMPLETED,
    bg: 'bg-success-surface',
    text: 'text-success',
    border: 'border-success/20',
  },
};

export default function CycleTable({ data, page, pageSize, onDetail }) {
  return (
    <div className='mt-5 flex min-h-0 flex-1 flex-col'>
      <div className='flex-1 overflow-auto'>
        <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
          <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
            <tr>
              <th className='text-muted w-[60px] px-6 py-4 text-xs font-semibold'>
                {EVALUATION_UI.TABLE_COLUMNS.STT}
              </th>
              <th className='text-muted w-[280px] px-6 py-4 text-xs font-semibold'>
                {EVALUATION_UI.TABLE_COLUMNS.CYCLE}
              </th>
              <th className='text-muted w-[140px] px-6 py-4 text-xs font-semibold'>
                {EVALUATION_UI.TABLE_COLUMNS.START_DATE}
              </th>
              <th className='text-muted w-[140px] px-6 py-4 text-xs font-semibold'>
                {EVALUATION_UI.TABLE_COLUMNS.END_DATE}
              </th>
              <th className='text-muted w-[150px] px-6 py-4 text-xs font-semibold'>
                {EVALUATION_UI.TABLE_COLUMNS.STATUS}
              </th>
              <th className='text-muted w-[120px] px-6 py-4 text-right text-xs font-semibold'>
                {EVALUATION_UI.TABLE_COLUMNS.ACTIONS}
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
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.border || 'border-transparent'}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Button
                      size='small'
                      icon={<EyeOutlined />}
                      onClick={() => onDetail(record)}
                      className='bg-primary/95 text-surface hover:!bg-primary rounded-full border-none font-bold shadow-sm transition-all'
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
