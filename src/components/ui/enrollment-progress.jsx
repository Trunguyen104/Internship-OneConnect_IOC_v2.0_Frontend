'use client';

import { Progress as AntdProgress } from 'antd';
import React from 'react';

import StatusBadge from '@/components/ui/status-badge';
import { ENTERPRISE_DASHBOARD_UI } from '@/constants/enterprise-dashboard/uiText';
import { cn } from '@/lib/cn';

export function EnrollmentProgress({
  label,
  current,
  total,
  startDate,
  endDate,
  statusLabel,
  color,
  className,
}) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  const getHexColor = (variant) => {
    const colors = {
      emerald: '#10b981',
      blue: '#3b82f6',
      neutral: '#94a3b8',
      rose: '#f43f5e',
    };
    return colors[variant] || '#94a3b8';
  };

  const hexColor = getHexColor(color);

  return (
    <div
      className={cn(
        'group relative flex items-center gap-6 py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-all duration-300 cursor-default px-4 rounded-xl',
        className
      )}
    >
      <div
        className="h-10 w-1 rounded-full shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: hexColor }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <h4 className="text-base font-bold text-slate-800 truncate tracking-tight uppercase">
            {label}
          </h4>
          <StatusBadge
            variant={color}
            label={statusLabel}
            variantType="minimal"
            className="scale-90 origin-left"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
            {startDate}
          </span>
          <span className="text-slate-300">{ENTERPRISE_DASHBOARD_UI.APPLICATIONS.ARROW}</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
            {endDate}
          </span>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center w-24 border-x border-slate-50 px-4">
        <span className="text-xl font-black text-slate-800 leading-none tabular-nums">{total}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
          {ENTERPRISE_DASHBOARD_UI.APPLICATIONS.SV}
        </span>
      </div>

      <div className="w-48 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {ENTERPRISE_DASHBOARD_UI.APPLICATIONS.ENROLLMENT_STATUS}
          </span>
          <span className="text-sm font-black italic tabular-nums" style={{ color: hexColor }}>
            {percent}%
          </span>
        </div>
        <AntdProgress
          percent={percent}
          showInfo={false}
          strokeColor={hexColor}
          size={{ height: 6 }}
          className="m-0 shadow-sm"
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            {ENTERPRISE_DASHBOARD_UI.APPLICATIONS.PLACED}
          </span>
          <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded tabular-nums">
            {current} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
