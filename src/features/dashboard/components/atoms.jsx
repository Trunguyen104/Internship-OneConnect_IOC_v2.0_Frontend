import { AlertCircle } from 'lucide-react';

export function StatCard({ label, value, icon, color, colorClass }) {
  return (
    <div className='group relative overflow-hidden rounded-3xl bg-surface border border-border/60 shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
      <div className='flex items-center justify-between mb-4'>
        <div className='text-sm font-medium text-muted'>{label}</div>
        <div className={`p-2.5 rounded-xl ${colorClass}`}>{icon}</div>
      </div>
      <div className='text-3xl font-bold text-text'>{value}</div>
      <div
        className='absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div
      className={[
        'rounded-3xl bg-surface border border-border/60 shadow-sm transition-shadow hover:shadow-md flex flex-col',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, right }) {
  return (
    <div className='px-6 py-5 border-b border-border/60 flex items-center justify-between bg-surface/50 rounded-t-3xl'>
      <div className='text-base font-semibold text-text'>{title}</div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className='flex-1 min-h-[200px] flex flex-col items-center justify-center text-sm text-muted gap-3 p-6'>
      <div className='w-12 h-12 rounded-full bg-bg flex items-center justify-center'>
        <AlertCircle className='w-6 h-6 text-muted/50' />
      </div>
      {text}
    </div>
  );
}

export function Loading() {
  return (
    <div className='rounded-3xl border border-border bg-surface p-12 flex flex-col items-center justify-center gap-4 text-sm text-muted shadow-sm'>
      <div className='w-8 h-8 rounded-full border-4 border-muted/20 border-t-primary animate-spin' />
      Loading dashboard data...
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div className='rounded-3xl border border-danger/20 bg-danger/5 p-6 shadow-sm'>
      <div className='flex items-center gap-2 text-danger font-semibold mb-2'>
        <AlertCircle className='w-5 h-5' />
        Error
      </div>
      <div className='text-sm text-danger/80'>{message}</div>
    </div>
  );
}

