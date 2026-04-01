'use client';

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Shield,
  Users,
} from 'lucide-react';
import React from 'react';

import { Card } from '@/components/ui/card';
import { UI_TEXT } from '@/lib/UI_Text';
import { formatRelativeTime } from '@/utils/date-utils';

/**
 * Gets consistent icons and styles for different activity types.
 */
function getActivityStyles(type) {
  switch (type?.toLowerCase()) {
    case 'university':
      return { icon: GraduationCap, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' };
    case 'enterprise':
      return { icon: Building2, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' };
    case 'student':
      return { icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' };
    case 'user':
      return { icon: Shield, iconColor: 'text-amber-600', iconBg: 'bg-amber-50' };
    default:
      return { icon: CheckCircle2, iconColor: 'text-slate-600', iconBg: 'bg-slate-50' };
  }
}

/**
 * RecentActivity - Displays the latest system events in a feed.
 */
export default function RecentActivity({ activities = [], loading = false }) {
  const { DASHBOARD } = UI_TEXT;

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-black tracking-tight text-slate-800">
            {DASHBOARD.RECENT_ACTIVITY}
          </h3>
          <p className="mt-0.5 text-[12px] font-medium text-slate-400">
            {DASHBOARD.LATEST_SYSTEM_EVENTS}
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2 text-[12px] font-bold text-slate-500 transition-colors hover:bg-gray-100 hover:text-slate-700">
          {DASHBOARD.VIEW_ALL} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col divide-y divide-gray-50">
        {loading ? (
          <div className="py-4 text-center text-sm text-slate-500 animate-pulse">
            {DASHBOARD.LOADING_ACTIVITIES}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-4 text-center text-sm text-slate-500">{DASHBOARD.NO_ACTIVITIES}</div>
        ) : (
          activities.map((item) => {
            const style = getActivityStyles(item.type);
            const Icon = style.icon;
            return (
              <div
                key={item.id}
                className="group flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${style.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-slate-700 transition-colors group-hover:text-primary">
                    {item.action}
                  </span>
                  <span className="block truncate text-[11px] font-medium text-slate-400">
                    {item.detail}
                  </span>
                </div>
                <span className="flex flex-shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(item.time)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
