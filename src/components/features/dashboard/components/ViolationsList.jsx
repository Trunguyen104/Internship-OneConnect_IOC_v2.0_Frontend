import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, EmptyState } from '@/components/ui/atoms';
import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

export function ViolationsList({ studentViolations }) {
  return (
    <Card>
      <CardHeader title={DASHBOARD_UI.WARNINGS_VIOLATIONS} />
      {studentViolations?.length ? (
        <div className='h-[340px] overflow-y-auto p-5'>
          <ul className='space-y-3'>
            {studentViolations.map((v) => (
              <li
                key={v.type}
                className='border-border/50 hover:border-danger/30 hover:bg-danger-surface bg-bg group flex items-center justify-between rounded-2xl border p-3.5 transition-all'
              >
                <div className='flex items-center gap-3.5'>
                  <div className='bg-danger-surface text-danger rounded-xl p-2 shadow-sm transition-transform group-hover:scale-110'>
                    <AlertCircle className='h-4 w-4' />
                  </div>
                  <span className='text-text text-sm font-medium'>{v.type}</span>
                </div>
                <span className='bg-danger-surface text-danger rounded-lg px-3 py-1.5 text-sm font-bold shadow-sm'>
                  {v.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState text={DASHBOARD_UI.NO_VIOLATION_DATA} />
      )}
    </Card>
  );
}
