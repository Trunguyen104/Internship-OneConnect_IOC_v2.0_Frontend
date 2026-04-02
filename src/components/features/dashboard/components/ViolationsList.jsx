'use client';

import { AlertCircle } from 'lucide-react';
import React from 'react';

import { Card, CardHeader, EmptyState } from '@/components/ui/atoms';
import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

export function ViolationsList({ studentViolations }) {
  return (
    <Card className="rounded-[32px] border-gray-100 shadow-sm overflow-hidden">
      <CardHeader
        title={
          <span className="text-gray-900 font-bold text-lg">
            {DASHBOARD_UI.WARNINGS_VIOLATIONS}
          </span>
        }
      />
      {studentViolations?.length ? (
        <div className="h-[340px] overflow-y-auto p-6">
          <ul className="space-y-4">
            {studentViolations.map((v) => (
              <li
                key={v.type}
                className="bg-gray-50/50 group flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition-all hover:border-danger/30 hover:bg-danger-surface"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white text-danger border border-gray-100 rounded-xl p-2 shadow-sm transition-transform group-hover:scale-110">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <span className="text-gray-900 text-sm font-semibold">{v.type}</span>
                </div>
                <span className="bg-danger-surface text-danger rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ring-danger/10">
                  {v.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState text={DASHBOARD_UI.NO_VIOLATION_DATA} />
      )}
    </Card>
  );
}
