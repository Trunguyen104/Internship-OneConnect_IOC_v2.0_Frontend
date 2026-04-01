'use client';

import { ArrowUpRight } from 'lucide-react';
import React from 'react';

import { Card } from '@/components/ui/card';

/**
 * StatCard - Single metric card for dashboard overview.
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-50',
  borderColor = 'border-blue-100',
  loading = false,
}) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-9 w-9 rounded-xl bg-gray-100" />
          <div className="h-3 w-12 rounded bg-gray-100" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-6 w-16 rounded bg-gray-100" />
          <div className="h-2 w-20 rounded bg-gray-100" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${borderColor}`}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-xl ${bgColor} p-2.5`}>
          <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-200" />
      </div>
      <div className="mt-3">
        <span className="block text-xl font-black tracking-tight text-slate-800">
          {value || '0'}
        </span>
        <span className="mt-0.5 block truncate text-[11px] font-bold text-slate-400">{title}</span>
      </div>
    </Card>
  );
}
