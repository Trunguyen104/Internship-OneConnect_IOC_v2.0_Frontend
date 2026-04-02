'use client';

import React, { memo } from 'react';

import { Card } from '@/components/ui/atoms';

const MetricCard = memo(function MetricCard({ title, value, icon, color, loading, suffix }) {
  if (loading) {
    return (
      <Card className="rounded-[32px] border-gray-100 bg-gray-50/50 p-7 h-full flex flex-col justify-center gap-4 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded-full" />
        <div className="h-10 w-32 bg-gray-200 rounded-full" />
      </Card>
    );
  }

  return (
    <Card className="group bg-white border-gray-100 relative h-full overflow-hidden rounded-[32px] border p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      {/* Animated Background Glow */}
      <div
        className="absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-5 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-10"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-400 text-[10px] font-extrabold tracking-[0.2em] uppercase">
              {title}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-gray-900 m-0 text-4xl font-black tracking-tighter">{value}</h2>
            {suffix && (
              <span className="text-gray-400 text-[11px] font-bold tracking-widest uppercase">
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className="flex size-14 items-center justify-center rounded-2xl text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
          style={{
            background: `color-mix(in srgb, ${color}, transparent 92%)`,
            color: color,
            border: `1px solid color-mix(in srgb, ${color}, transparent 85%)`,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
});

export default MetricCard;
