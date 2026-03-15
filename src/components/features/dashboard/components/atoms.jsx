import { AlertCircle } from 'lucide-react';

import { DASHBOARD_UI } from '@/constants/dashboard';

export function StatCard({ label, value, icon, color, colorClass }) {
  return (
    <div className='group bg-surface border-border/60 relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='text-muted text-sm font-medium'>{label}</div>
        <div className={`rounded-xl p-2.5 ${colorClass}`}>{icon}</div>
      </div>
      <div className='text-text text-3xl font-bold'>{value}</div>
      <div
        className='absolute bottom-0 left-0 h-1 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div
      className={[
        'bg-surface border-border/60 flex flex-col rounded-3xl border shadow-sm transition-shadow hover:shadow-md',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, right }) {
  return (
    <div className='border-border/60 bg-surface/50 flex items-center justify-between rounded-t-3xl border-b px-6 py-5'>
      <div className='text-text text-base font-semibold'>{title}</div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className='text-muted flex min-h-[200px] flex-1 flex-col items-center justify-center gap-3 p-6 text-sm'>
      <div className='bg-bg flex h-12 w-12 items-center justify-center rounded-full'>
        <AlertCircle className='text-muted/50 h-6 w-6' />
      </div>
      {text}
    </div>
  );
}

export function Loading() {
  return (
    <div className='border-border bg-surface text-muted flex flex-col items-center justify-center gap-4 rounded-3xl border p-12 text-sm shadow-sm'>
      <div className='border-muted/20 border-t-primary h-8 w-8 animate-spin rounded-full border-4' />
      {DASHBOARD_UI.LOADING}
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div className='border-danger/20 bg-danger-surface rounded-3xl border p-6 shadow-sm'>
      <div className='text-danger mb-2 flex items-center gap-2 font-semibold'>
        <AlertCircle className='h-5 w-5' />
        {DASHBOARD_UI.ERROR}
      </div>
      <div className='text-danger/80 text-sm'>{message}</div>
    </div>
  );
}
