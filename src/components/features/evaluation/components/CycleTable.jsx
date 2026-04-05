'use client';

import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';

import StatusBadge from '@/components/ui/status-badge';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

const STATUS_CONFIG = {
  1: {
    label: EVALUATION_UI.STATUS.PENDING,
    variant: 'warning',
  },
  2: {
    label: EVALUATION_UI.STATUS.DRAFT,
    variant: 'warning',
  },
  3: {
    label: EVALUATION_UI.STATUS.SUBMITTED,
    variant: 'info',
  },
  4: {
    label: EVALUATION_UI.STATUS.PUBLISHED,
    variant: 'success',
  },
  PENDING: {
    label: EVALUATION_UI.STATUS.PENDING,
    variant: 'warning',
  },
  DRAFT: {
    label: EVALUATION_UI.STATUS.DRAFT,
    variant: 'warning',
  },
  SUBMITTED: {
    label: EVALUATION_UI.STATUS.SUBMITTED,
    variant: 'info',
  },
  PUBLISHED: {
    label: EVALUATION_UI.STATUS.PUBLISHED,
    variant: 'success',
  },
  COMPLETED: {
    label: EVALUATION_UI.STATUS.PUBLISHED,
    variant: 'success',
  },
};

const getTimelineStatus = (start, end) => {
  if (!start || !end) return null;
  const now = dayjs();
  const s = dayjs(start);
  const e = dayjs(end);

  if (now.isBefore(s)) return { label: EVALUATION_UI.STATUS.UPCOMING, variant: 'neutral' };
  if (now.isAfter(e)) return { label: EVALUATION_UI.STATUS.COMPLETED, variant: 'success' };
  return { label: EVALUATION_UI.STATUS.ONGOING, variant: 'primary' };
};

export default function CycleTable({ data, page, pageSize, onDetail }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
          <thead className="border-border bg-bg sticky top-0 z-10 border-b">
            <tr>
              <th className="text-muted w-[60px] px-6 py-4 text-xs font-semibold">
                {EVALUATION_UI.TABLE_COLUMNS.STT}
              </th>
              <th className="text-muted w-[280px] px-6 py-4 text-xs font-semibold">
                {EVALUATION_UI.TABLE_COLUMNS.CYCLE}
              </th>
              <th className="text-muted w-[140px] px-6 py-4 text-xs font-semibold">
                {EVALUATION_UI.TABLE_COLUMNS.START_DATE}
              </th>
              <th className="text-muted w-[140px] px-6 py-4 text-xs font-semibold">
                {EVALUATION_UI.TABLE_COLUMNS.END_DATE}
              </th>
              <th className="text-muted w-[150px] px-6 py-4 text-xs font-semibold">
                {EVALUATION_UI.TABLE_COLUMNS.STATUS}
              </th>
              <th className="text-muted w-[120px] px-6 py-4 text-right text-xs font-semibold">
                {EVALUATION_UI.TABLE_COLUMNS.ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/50 divide-y">
            {data.map((record, index) => {
              const timeline = getTimelineStatus(record.startDate, record.endDate);
              const status = record.status;
              const normalized = status ? String(status).toUpperCase() : '';
              const cfg = timeline ||
                STATUS_CONFIG[normalized] ||
                STATUS_CONFIG[status] || {
                  label: status || 'Unknown',
                  variant: 'neutral',
                };

              return (
                <tr key={record.cycleId} className="hover:bg-bg/80 transition-colors">
                  <td className="text-muted px-6 py-4 text-sm">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-text font-bold tracking-tight">{record.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-muted text-sm">
                      {dayjs(record.startDate).format('DD/MM/YYYY')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-muted text-sm">
                      {dayjs(record.endDate).format('DD/MM/YYYY')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge variant={cfg.variant} label={cfg.label} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => onDetail(record)}
                      className="bg-primary/95 text-surface hover:!bg-primary rounded-full border-none font-bold shadow-sm transition-all"
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
