'use client';

import React from 'react';

import { Card } from '@/components/ui/card';
import { UI_TEXT } from '@/lib/UI_Text';

/**
 * SystemHealth - Displays real-time system metrics like CPU, RAM, and Database status.
 */
export default function SystemHealth({ healthData = [], loading = false }) {
  const { DASHBOARD } = UI_TEXT;

  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-[15px] font-black tracking-tight text-slate-800">
          {DASHBOARD.SYSTEM_HEALTH}
        </h3>
        <p className="mt-0.5 text-[12px] font-medium text-slate-400">
          {DASHBOARD.REAL_TIME_STATUS}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-2 text-center text-sm text-slate-500 animate-pulse">
            {DASHBOARD.CHECKING_HEALTH}
          </div>
        ) : (
          healthData.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-500">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-black text-slate-700">{item.value}</span>
                <div
                  className={`h-2 w-2 rounded-full ${
                    item.status === 'good' ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
