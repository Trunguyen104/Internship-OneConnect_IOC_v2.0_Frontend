import { Skeleton } from 'antd';

import { cn } from '@/lib/cn';

const SummaryCard = ({
  title,
  value,
  suffix,
  icon,
  variant = 'neutral',
  active = false,
  onClick,
  loading = false,
}) => {
  const colorMap = {
    neutral: 'var(--gray-500)',
    success: 'var(--green-500)',
    warning: 'var(--yellow-500)',
    danger: 'var(--primary-500)',
    info: 'var(--blue-500)',
  };

  const color = colorMap[variant] || colorMap.neutral;

  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-500'
      )}
    >
      {/* Animated Background Glow (MetricCard Style) */}
      <div
        className="absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-5 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-10"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-between">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <span className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--gray-500)]">
              {title}
            </span>
          </div>

          <div className="flex items-baseline gap-3 overflow-hidden">
            {loading ? (
              <Skeleton.Button active size="small" className="!w-16 !h-10 !min-w-[64px]" />
            ) : (
              <h2 className="m-0 text-4xl font-bold tracking-tighter text-[var(--color-text)] pr-2">
                {value}
              </h2>
            )}
            {suffix && (
              <span className="truncate text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)]">
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className="ml-4 flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
          style={{
            background: `color-mix(in srgb, ${color}, transparent 92%)`,
            color: color,
            border: `1px solid color-mix(in srgb, ${color}, transparent 85%)`,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
