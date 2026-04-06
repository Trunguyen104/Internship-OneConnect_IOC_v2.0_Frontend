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
        <div className={`rounded-lg ${bgColor} p-2`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <ArrowUpRight className="h-3 w-3 text-slate-200" />
      </div>
      <div className="mt-2">
        <span className="block text-lg font-black tracking-tight text-slate-800">
          {value || '0'}
        </span>
        <span className="mt-0.5 block truncate text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {title}
        </span>
      </div>
    </Card>
  );
}
