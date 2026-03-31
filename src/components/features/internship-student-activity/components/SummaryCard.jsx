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
    neutral: '#94a3b8', // slate-400
    success: '#10b981', // green-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
  };

  const color = colorMap[variant] || colorMap.neutral;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex h-[88px] cursor-pointer items-center overflow-hidden rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl',
        active && 'ring-2 ring-primary border-primary bg-primary/[0.02]'
      )}
    >
      {/* Background Glow */}
      <div
        className="absolute -right-10 -top-10 h-20 w-20 rounded-full opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-10"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-between">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2 overflow-hidden">
            <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <span className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              {title}
            </span>
          </div>

          <div className="flex items-baseline gap-2 overflow-hidden">
            {loading ? (
              <Skeleton.Button active size="small" className="!w-12 !h-6 !min-w-[48px]" />
            ) : (
              <h2 className="m-0 text-3xl italic font-black leading-none tracking-tighter text-slate-900 pr-2">
                {value}
              </h2>
            )}
            {suffix && (
              <span className="mb-0.5 truncate text-[9px] font-black uppercase tracking-widest text-slate-400">
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className="ml-4 flex size-11 shrink-0 items-center justify-center rounded-xl text-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
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
