import { BankOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Progress, Tag, Typography } from 'antd';
import React from 'react';

import { ACTIVE_TERM_UI } from '../constants/uiText';

const { Title, Text } = Typography;

/**
 * TermCard Compound Component
 * Architecture follows vercel-composition-patterns:
 * - No boolean prop proliferation
 * - Logical sub-components
 */
export const TermCard = ({ children, className = '' }) => {
  return (
    <div
      className={`group relative flex flex-col gap-6 rounded-4xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:flex-row md:items-center ${className}`}
    >
      {/* Accent border on the left */}
      <div className="absolute bottom-6 left-0 top-6 w-1.5 rounded-r-full bg-primary" />
      {children}
    </div>
  );
};

const TermCardHeader = ({ title, university, status, startDate, endDate }) => (
  <div className="flex flex-1 flex-col gap-6">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Title level={4} style={{ margin: 0, fontWeight: 800, color: 'var(--color-text)' }}>
          {title}
        </Title>
        <Tag className="m-0 rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600 shadow-sm">
          {status}
        </Tag>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <BankOutlined className="text-gray-400" />
        <Text type="secondary" className="font-medium text-sm">
          {university}
        </Text>
      </div>
    </div>

    <div className="flex gap-8">
      <div className="flex flex-col gap-1">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {ACTIVE_TERM_UI.DATE.START}
        </Text>
        <Text className="font-bold text-gray-900">{startDate}</Text>
      </div>
      <div className="flex flex-col gap-1">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {ACTIVE_TERM_UI.DATE.END}
        </Text>
        <Text className="font-bold text-gray-900">{endDate}</Text>
      </div>
    </div>
  </div>
);

const TermCardDates = ({ daysRemaining, progressPercent }) => (
  <div className="flex flex-1 flex-col gap-2 border-x border-gray-100 px-12 md:w-1/3">
    <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {'TERM PROGRESS'}
    </Text>
    <Progress
      percent={progressPercent}
      showInfo={false}
      strokeColor={{
        '0%': 'var(--primary-300)',
        '100%': 'var(--primary-600)',
      }}
      railColor="var(--gray-100)"
      size={{ height: 8 }}
    />
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-baseline gap-1">
        <Text className="text-3xl font-black text-gray-900">{progressPercent}%</Text>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 border border-red-100 shadow-sm">
        <ClockCircleOutlined className="text-red-500" />
        <Text className="text-sm font-bold text-red-600">
          {daysRemaining} {ACTIVE_TERM_UI.STATUS.DAYS_REMAINING_LABEL || 'days left'}
        </Text>
      </div>
    </div>
  </div>
);

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
      <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {'IMPORTANT DEADLINES'}
      </Text>
      {allDeadlines.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-between rounded-2xl p-4 transition-all hover:shadow-md ${
            item.isUrgent
              ? 'bg-red-50 border border-red-100'
              : 'bg-gray-50 border border-transparent'
          }`}
        >
          <div className="flex flex-col">
            <Text className="text-xs font-bold text-gray-900">{item.label}</Text>
            <Text className="text-[11px] text-gray-400 font-medium">{item.date}</Text>
          </div>
          {item.isUrgent && (
            <Tag color="#fee2e2" className="border-red-200 text-red-600 font-bold text-[10px] m-0">
              {'URGENT'}
            </Tag>
          )}
        </div>
      ))}
    </div>
  );
};

// Assign sub-components to the main component
TermCard.Header = TermCardHeader;
TermCard.Dates = TermCardDates;
TermCard.Deadlines = TermCardDeadlines;
