'use client';
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Empty, Input, Progress, Skeleton, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { createContext, useContext, useMemo, useState } from 'react';

import { useActiveTermsData } from '../hooks/useActiveTermsData';

const { Title, Text } = Typography;

// --- Context for Compound Component Pattern ---
const ActiveTermsContext = createContext();

export function useActiveTerms() {
  const context = useContext(ActiveTermsContext);
  if (!context) {
    throw new Error('useActiveTerms must be used within ActiveTermsDashboard');
  }
  return context;
}

// --- Main Provider & Container ---
export default function ActiveTermsDashboard({ children }) {
  const { terms, cycles, isLoading, error } = useActiveTermsData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = useMemo(() => {
    if (!searchQuery) return terms;
    return terms.filter((term) => term.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [terms, searchQuery]);

  // Context Payload
  const value = useMemo(
    () => ({
      terms: filteredTerms,
      allCycles: cycles,
      isLoading,
      error,
      searchQuery,
      setSearchQuery,
    }),
    [filteredTerms, cycles, isLoading, error, searchQuery]
  );

  return (
    <ActiveTermsContext.Provider value={value}>
      <div className="flex flex-col gap-6 w-full">
        {children || (
          <>
            <ActiveTermsDashboard.Header />
            <ActiveTermsDashboard.List />
          </>
        )}
      </div>
    </ActiveTermsContext.Provider>
  );
}

// --- Compound Components ---

ActiveTermsDashboard.Header = function ActiveTermsHeader() {
  const { searchQuery, setSearchQuery } = useActiveTerms();

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
      <div className="flex flex-col">
        <Title level={2} className="!mb-1 text-text">
          Active Internship Terms
        </Title>
        <Text className="text-muted text-sm">
          Overview of currently running internship terms, their progress, and important evaluation
          deadlines.
        </Text>
      </div>
      <div className="w-full md:w-72 mt-1 md:mt-0">
        <Input.Search
          placeholder="Search terms..."
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          enterButton={<SearchOutlined />}
          size="middle"
        />
      </div>
    </div>
  );
};

ActiveTermsDashboard.List = function ActiveTermsList() {
  const { terms, allCycles, isLoading, error } = useActiveTerms();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-surface border border-danger p-6 rounded-lg text-danger">
        <Title level={4} className="!text-danger !m-0">
          Error Loading Dashboard
        </Title>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!terms || terms.length === 0) {
    return (
      <Card className="shadow-sm border-border rounded-xl">
        <Empty description="No active internship terms found" />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {terms.map((term) => {
        // Find cycles strictly belonging to this term using standard relational checks
        const termCycles = allCycles.filter(
          (c) =>
            String(c.termId) === String(term.id) ||
            String(c.internshipTermId) === String(term.id) ||
            String(c.term?.id) === String(term.id)
        );
        return <TermCard key={term.id} term={term} cycles={termCycles} />;
      })}
    </div>
  );
};

// --- Private Components (Used Internally) ---

function SkeletonCard() {
  return (
    <Card className="shadow-sm border-border rounded-xl">
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
  );
}

function TermCard({ term, cycles }) {
  // Normalize dates safely
  const startDate = term.startDate ? dayjs(term.startDate) : null;
  const endDate = term.endDate ? dayjs(term.endDate) : null;
  const now = dayjs();

  // Calculate Progress Logic
  let percent = 0;
  let progressStatusLabel = 'Not Started';
  let daysLeftText = '';

  if (startDate && endDate) {
    const totalDays = endDate.diff(startDate, 'day');
    const elapsedDays = now.diff(startDate, 'day');

    if (now.isBefore(startDate)) {
      percent = 0;
      progressStatusLabel = 'Not Started';
      daysLeftText = `Starts in ${Math.max(0, startDate.diff(now, 'day'))} days`;
    } else if (now.isAfter(endDate)) {
      percent = 100;
      progressStatusLabel = 'Completed';
      daysLeftText = 'Term ended';
    } else {
      percent = Math.max(0, Math.min(100, Math.round((elapsedDays / totalDays) * 100)));
      progressStatusLabel = 'In Progress';
      daysLeftText = `${Math.max(0, endDate.diff(now, 'day'))} days left`;
    }
  }

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border rounded-xl overflow-hidden active-term-card"
      styles={{ body: { padding: 0 } }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x divide-border">
        {/* Column 1: Basic Info */}
        <div className="p-6 col-span-1 md:col-span-5 lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <Title level={3} className="!m-0 !text-lg !font-semibold text-text line-clamp-2">
                {term.name || 'Unnamed Term'}
              </Title>
              <Tag color="success" className="!m-0 shrink-0 font-medium">
                ACTIVE
              </Tag>
            </div>
            <p className="text-muted text-sm line-clamp-2">
              {term.description || 'Internship term details and information'}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-1">
            <div className="text-sm">
              <span className="text-muted mr-2">Start:</span>
              <span className="font-medium text-text">
                {startDate ? startDate.format('MMM DD, YYYY') : 'TBD'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted mr-2">End:</span>
              <span className="font-medium text-text">
                {endDate ? endDate.format('MMM DD, YYYY') : 'TBD'}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Timeline Progress */}
        <div className="p-6 col-span-1 md:col-span-4 lg:col-span-4 flex flex-col justify-center bg-[var(--color-bg)] h-full">
          <Text className="text-xs font-semibold text-muted tracking-wider uppercase mb-4 block">
            Term Progress
          </Text>
          <div className="mt-2">
            <Progress
              percent={percent}
              status={percent === 100 ? 'success' : 'normal'}
              strokeColor={percent === 100 ? 'var(--color-success)' : 'var(--color-primary)'}
              trailColor="var(--color-border)"
              className="mb-1"
              showInfo={false}
            />
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="font-semibold text-text">{progressStatusLabel}</span>
              <span className="font-medium text-muted">{daysLeftText}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Critical Deadlines */}
        <div className="p-6 col-span-1 md:col-span-3 lg:col-span-4 flex flex-col h-full">
          <Text className="text-xs font-semibold text-muted tracking-wider uppercase mb-4 block">
            IMPORTANT DEADLINES
          </Text>
          <div
            className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
            style={{ maxHeight: '130px' }}
          >
            <DeadlinesList cycles={cycles} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function DeadlinesList({ cycles }) {
  if (!cycles || cycles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-60 mt-4">
        <CalendarOutlined className="text-2xl text-muted mb-2" />
        <span className="text-sm text-muted text-center">No deadlines scheduled yet</span>
      </div>
    );
  }

  const now = dayjs();

  // Sort deadlines by closest ascending
  const sortedCycles = [...cycles].sort((a, b) => {
    const dateA = a.endDate || a.deadline;
    const dateB = b.endDate || b.deadline;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dayjs(dateA).diff(dayjs(dateB));
  });

  return (
    <div className="flex flex-col gap-4">
      {sortedCycles.map((cycle, idx) => {
        const deadlineDate = cycle.endDate || cycle.deadline;
        const deadlineObj = deadlineDate ? dayjs(deadlineDate) : null;
        let isUrgent = false;

        if (deadlineObj) {
          const daysAway = deadlineObj.diff(now, 'day');
          // Mark urgent if <= 7 days and not extremely past
          isUrgent = daysAway <= 7 && daysAway >= -14;
        }

        return (
          <div
            key={cycle.id || idx}
            className="flex flex-col gap-1.5 border-l-2 pl-3 border-[var(--color-primary)]"
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`text-sm font-semibold line-clamp-1 ${isUrgent ? 'text-danger' : 'text-text'}`}
              >
                {cycle.name || 'Evaluation Cycle'}
              </span>
              {isUrgent ? (
                <Tag color="error" className="!m-0 !text-[10px] shrink-0 font-bold border-none">
                  URGENT
                </Tag>
              ) : null}
            </div>
            <div className={`text-xs font-medium ${isUrgent ? 'text-danger/80' : 'text-muted'}`}>
              {deadlineObj ? deadlineObj.format('MMM DD, YYYY') : 'Not Set'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
