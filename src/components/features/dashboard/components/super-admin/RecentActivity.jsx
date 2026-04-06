'use client';

import {
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  FolderKanban,
  GraduationCap,
  Layers,
  Shield,
  Users,
} from 'lucide-react';
import React from 'react';

import { Card } from '@/components/ui/card';
import { UI_TEXT } from '@/lib/UI_Text';
import { formatAbsoluteDateTimeUtc, formatRelativeTime } from '@/utils/date-utils';

/**
 * Icon + tint by normalized category (aligned with backend AuditActivityMapper.MapCategory).
 */
function getActivityStyles(category) {
  const c = String(category || 'other').toLowerCase();
  switch (c) {
    case 'university':
      return { icon: GraduationCap, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' };
    case 'enterprise':
      return { icon: Building2, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' };
    case 'student':
      return { icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' };
    case 'user':
      return { icon: Shield, iconColor: 'text-amber-600', iconBg: 'bg-amber-50' };
    case 'job':
      return { icon: Briefcase, iconColor: 'text-orange-600', iconBg: 'bg-orange-50' };
    case 'application':
      return { icon: FileText, iconColor: 'text-cyan-600', iconBg: 'bg-cyan-50' };
    case 'term':
      return { icon: Bell, iconColor: 'text-sky-600', iconBg: 'bg-sky-50' };
    case 'group':
      return { icon: Layers, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50' };
    case 'project':
      return { icon: FolderKanban, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' };
    default:
      return { icon: CheckCircle2, iconColor: 'text-slate-600', iconBg: 'bg-slate-50' };
  }
}

function actionKindBadgeClass(kind) {
  const k = String(kind || '').toLowerCase();
  if (k === 'delete') return 'bg-rose-50 text-rose-700 ring-1 ring-rose-100';
  if (k === 'create') return 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100';
  if (k === 'update') return 'bg-amber-50 text-amber-900 ring-1 ring-amber-100';
  if (k === 'resetpassword') return 'bg-violet-50 text-violet-800 ring-1 ring-violet-100';
  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80';
}

function pickActivity(raw) {
  return {
    id: raw.id ?? raw.Id,
    summary: raw.summary ?? raw.Summary ?? raw.action ?? raw.Action ?? '',
    detail: raw.detail ?? raw.Detail ?? '',
    time: raw.time ?? raw.Time,
    category: raw.category ?? raw.Category ?? raw.type ?? raw.Type ?? 'other',
    actorName: raw.actorName ?? raw.ActorName,
    actorEmail: raw.actorEmail ?? raw.ActorEmail,
    actionKind: raw.actionKind ?? raw.ActionKind ?? '',
    entityId: raw.entityId ?? raw.EntityId,
  };
}

/**
 * Recent audit activity — detailed rows: summary, detail, actor, UTC + relative time, action kind.
 */
export default function RecentActivity({ activities = [], loading = false }) {
  const { DASHBOARD } = UI_TEXT;

  return (
    <Card className="col-span-1 flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-[15px] font-black tracking-tight text-slate-800">
            {DASHBOARD.RECENT_ACTIVITY}
          </h3>
          <p className="mt-1 max-w-2xl text-[12px] font-medium leading-relaxed text-slate-500">
            {DASHBOARD.LATEST_SYSTEM_EVENTS}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col divide-y divide-gray-100 pr-2">
        {loading ? (
          <div className="animate-pulse py-6 text-center text-sm text-slate-500">
            {DASHBOARD.LOADING_ACTIVITIES}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">{DASHBOARD.NO_ACTIVITIES}</div>
        ) : (
          activities.map((raw) => {
            const item = pickActivity(raw);
            const style = getActivityStyles(item.category);
            const Icon = style.icon;
            const abs = formatAbsoluteDateTimeUtc(item.time);
            const rel = formatRelativeTime(item.time);
            const actor = item.actorName
              ? `${item.actorName}${item.actorEmail ? ` · ${item.actorEmail}` : ''}`
              : item.actorEmail || null;

            return (
              <article
                key={item.id}
                className="group py-4 first:pt-0 last:pb-0"
                aria-label={item.summary}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}
                  >
                    <Icon className={`h-[18px] w-[18px] ${style.iconColor}`} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <span className="text-[13px] font-bold leading-snug text-slate-900">
                        {item.summary}
                      </span>
                      {item.actionKind ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${actionKindBadgeClass(item.actionKind)}`}
                        >
                          {item.actionKind}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[12px] leading-relaxed text-slate-600 break-words">
                      {item.detail}
                    </p>
                    <dl className="grid gap-1.5 text-[11px] text-slate-500 sm:grid-cols-1">
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <dt className="sr-only">{DASHBOARD.ACTOR_LABEL}</dt>
                        <dd>
                          <span className="font-semibold text-slate-600">
                            {DASHBOARD.ACTOR_LABEL}:
                          </span>{' '}
                          {actor ?? DASHBOARD.SYSTEM_ACTOR}
                        </dd>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-dashed border-slate-100 pt-2">
                        <div>
                          <span className="font-semibold text-slate-600">{DASHBOARD.AT_UTC}:</span>{' '}
                          <time
                            dateTime={item.time}
                            className="font-mono text-[11px] text-slate-600"
                          >
                            {abs}
                          </time>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-600">
                            {DASHBOARD.RELATIVE}:
                          </span>{' '}
                          <span className="text-slate-600">{rel}</span>
                        </div>
                        {item.entityId ? (
                          <div className="min-w-0 sm:max-w-full">
                            <span className="font-semibold text-slate-600">
                              {DASHBOARD.ENTITY_ID_LABEL}:
                            </span>{' '}
                            <span className="break-all font-mono text-[10px] text-slate-600">
                              {String(item.entityId)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {!loading && activities.length > 0 && (
        <p className="mt-4 border-t border-gray-50 pt-3 text-[11px] font-medium leading-relaxed text-slate-400">
          {DASHBOARD.ACTIVITY_FOOTNOTE}
        </p>
      )}
    </Card>
  );
}
