import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, EmptyState } from './atoms';

export function ViolationsList({ studentViolations }) {
  return (
    <Card>
      <CardHeader title='Warnings & Violations' />
      {studentViolations?.length ? (
        <div className='p-5 h-[340px] overflow-y-auto'>
          <ul className='space-y-3'>
            {studentViolations.map((v) => (
              <li
                key={v.type}
                className='group flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-border/50 hover:border-danger/30 hover:bg-danger/5 transition-all'
              >
                <div className='flex items-center gap-3.5'>
                  <div className='p-2 rounded-xl bg-danger/10 text-danger shadow-sm group-hover:scale-110 transition-transform'>
                    <AlertCircle className='w-4 h-4' />
                  </div>
                  <span className='text-sm font-medium text-text'>{v.type}</span>
                </div>
                <span className='text-sm font-bold text-danger bg-danger/10 px-3 py-1.5 rounded-lg shadow-sm'>
                  {v.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState text='No violation data' />
      )}
    </Card>
  );
}

