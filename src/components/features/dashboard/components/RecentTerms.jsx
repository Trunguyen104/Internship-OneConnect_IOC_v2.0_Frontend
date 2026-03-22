'use client';

import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { DASHBOARD, TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
const { RECENT_TERMS } = DASHBOARD;

const STATUS_CONFIG = {
  1: { bgClass: 'bg-info/10', textClass: 'text-info', dotClass: 'bg-info' },
  2: { bgClass: 'bg-success/10', textClass: 'text-success', dotClass: 'bg-success' },
  3: { bgClass: 'bg-warning/10', textClass: 'text-warning', dotClass: 'bg-warning' },
  4: { bgClass: 'bg-danger/10', textClass: 'text-danger', dotClass: 'bg-danger' },
  Upcoming: { bgClass: 'bg-info/10', textClass: 'text-info', dotClass: 'bg-info' },
  Active: { bgClass: 'bg-success/10', textClass: 'text-success', dotClass: 'bg-success' },
  Ended: { bgClass: 'bg-warning/10', textClass: 'text-warning', dotClass: 'bg-warning' },
  Closed: { bgClass: 'bg-danger/10', textClass: 'text-danger', dotClass: 'bg-danger' },
};

const TermCard = ({ term }) => {
  const config = STATUS_CONFIG[term.status] || {
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-500',
    dotClass: 'bg-gray-400',
  };
  const label = TERM_MANAGEMENT.STATUS_LABELS[term.status] || term.status;

  return (
    <div className="group bg-surface ring-border/50 relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-sm ring-1 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="bg-primary/5 absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full transition-transform duration-700 group-hover:scale-150" />

      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-2 rounded-full ${config.bgClass} px-3 py-1 transition-transform group-hover:scale-105`}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${config.dotClass} animate-pulse`} />
            <span
              className={`${config.textClass} text-[10px] font-black tracking-widest uppercase`}
            >
              {label}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-text group-hover:text-primary line-clamp-2 min-h-[3rem] text-lg leading-tight font-black tracking-tight transition-colors">
            {term.name}
          </h4>
          <p className="text-muted mt-1 text-[10px] font-bold tracking-widest uppercase opacity-60">
            {RECENT_TERMS.SUBTITLE}
          </p>
        </div>

        <div className="bg-primary/5 group-hover:bg-primary/10 flex items-center gap-3 rounded-2xl p-3 transition-colors">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
            <CalendarOutlined className="text-primary text-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-text text-[11px] leading-none font-bold">
              {dayjs(term.startDate).format(RECENT_TERMS.START_MONTH_FORMAT)}
            </span>
            <span className="text-muted mt-1 text-[9px] font-medium opacity-70">
              {RECENT_TERMS.START_DATE}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentTerms = memo(function RecentTerms({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[1, 2, 4].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col space-y-6 duration-700">
      <div className="no-scrollbar grid grid-cols-1 gap-6 overflow-y-auto pr-2 pb-4 sm:grid-cols-2 lg:max-h-[850px]">
        {data.length > 0 ? (
          data.map((term) => <TermCard key={term.termId} term={term} />)
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted text-sm font-medium">{RECENT_TERMS.EMPTY_TEXT}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default RecentTerms;
