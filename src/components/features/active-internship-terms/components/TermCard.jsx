import { BankOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Progress, Tag } from 'antd';
import React from 'react';

import { ACTIVE_TERM_UI } from '@/constants/active-internship-terms/uiText';

/**
 * TermCard Compound Component
 * Architecture follows vercel-composition-patterns:
 * - No boolean prop proliferation
 * - Logical sub-components
 */
export const TermCard = ({ children, className = '' }) => {
  return (
    <div
      className={`group relative flex flex-col gap-6 rounded-[32px] border border-gray-100 bg-surface p-8 shadow-sm transition-all duration-300 hover:shadow-xl md:flex-row md:items-center ${className}`}
    >
      {/* Accent border on the left */}
      <div className="absolute bottom-10 left-0 top-10 w-1 rounded-r-full bg-primary" />
      {children}
    </div>
  );
};

const TermCardHeader = ({ title, university, status, startDate, endDate }) => (
  <div className="flex flex-1 flex-col gap-6">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="m-0 text-xl font-black tracking-tight text-text">{title}</h2>
        <Tag className="m-0 rounded-full border-none bg-success-surface px-3 py-1 text-[10px] font-bold text-success shadow-sm">
          {status}
        </Tag>
      </div>
      <div className="flex items-center gap-2 text-muted">
        <BankOutlined className="text-muted/60" />
        <span className="text-sm font-medium">{university}</span>
      </div>
    </div>

    <div className="flex gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
          {ACTIVE_TERM_UI.DATE.START}
        </span>
        <span className="text-sm font-black text-text">{startDate}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
          {ACTIVE_TERM_UI.DATE.END}
        </span>
        <span className="text-sm font-black text-text">{endDate}</span>
      </div>
    </div>
  </div>
);

const TermCardDates = ({ daysRemaining, progressPercent }) => {
  const daysLeftLabel = `${daysRemaining}${ACTIVE_TERM_UI.PROGRESS.DAYS_LEFT}`;
  const progressLabel = `${progressPercent}%`;

  return (
    <div className="flex flex-1 flex-col gap-2 border-gray-100 px-12 md:w-1/3 md:border-x">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
        {ACTIVE_TERM_UI.PROGRESS.TITLE}
      </span>
      <Progress
        percent={progressPercent}
        showInfo={false}
        strokeColor={{
          '0%': 'var(--primary-300)',
          '100%': 'var(--primary-600)',
        }}
        railColor="var(--gray-100)"
        size={{ height: 10 }}
      />
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black tracking-tighter text-text">{progressLabel}</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-danger-surface px-4 py-2 text-danger border border-danger/10 shadow-sm transition-transform hover:scale-105">
          <ClockCircleOutlined className="text-xs" />
          <span className="text-sm font-black uppercase tracking-tight">{daysLeftLabel}</span>
        </div>
      </div>
    </div>
  );
};

const TermCardDeadlines = ({ deadlines = [] }) => {
  // If no deadlines, show a placeholder box as requested
  const allDeadlines =
    deadlines.length > 0
      ? deadlines.map((d) => ({
          label: d.cycleName,
          date: d.deadlineDate ? new Date(d.deadlineDate).toLocaleDateString('en-GB') : 'N/A',
          isUrgent: d.isWarning || d.isOverdue,
        }))
      : [{ label: 'SPECIFIC DEADLINE', date: 'N/A', isUrgent: false }];

  return (
    <div className="flex flex-col gap-3 md:w-1/4">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
        {ACTIVE_TERM_UI.DEADLINE.IMPORTANT_TITLE}
      </span>
      {allDeadlines.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between rounded-2xl bg-gray-50/50 border border-transparent p-4 transition-all hover:shadow-md"
        >
          <div className="flex flex-col">
            <span className="text-xs font-black text-text">{item.label}</span>
            <span className="text-[10px] font-medium text-muted">{item.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Assign sub-components to the main component
TermCard.Header = TermCardHeader;
TermCard.Dates = TermCardDates;
TermCard.Deadlines = TermCardDeadlines;
