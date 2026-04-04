'use client';

import { Building2, GraduationCap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Card } from '@/components/ui/card';
import { UI_TEXT } from '@/lib/UI_Text';

/**
 * QuickActions - Grid of links for frequent admin tasks.
 */
export default function QuickActions() {
  const { DASHBOARD } = UI_TEXT;

  const actions = [
    {
      label: DASHBOARD.ACTION_ADD_UNI,
      description: DASHBOARD.DESC_ADD_UNI,
      icon: GraduationCap,
      color: 'bg-emerald-500',
      href: '/admin/universities',
    },
    {
      label: DASHBOARD.ACTION_ADD_ENT,
      description: DASHBOARD.DESC_ADD_ENT,
      icon: Building2,
      color: 'bg-violet-500',
      href: '/admin/enterprises',
    },
    {
      label: DASHBOARD.ACTION_MANAGE_USERS,
      description: DASHBOARD.DESC_MANAGE_USERS,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      label: DASHBOARD.ACTION_VIEW_REPORTS,
      description: DASHBOARD.DESC_VIEW_REPORTS,
      icon: TrendingUp,
      color: 'bg-rose-500',
      href: '/admin/dashboard',
    },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-[15px] font-black tracking-tight text-slate-800">
          {DASHBOARD.QUICK_ACTIONS}
        </h3>
        <p className="mt-0.5 text-[12px] font-medium text-slate-400">
          {DASHBOARD.COMMON_ADMIN_TASKS}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link
              key={i}
              href={action.href}
              className="group flex flex-col items-start gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="block text-[12px] font-black text-slate-700 transition-colors group-hover:text-primary">
                  {action.label}
                </span>
                <span className="block text-[10px] font-medium text-slate-400 leading-tight mt-0.5">
                  {action.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
