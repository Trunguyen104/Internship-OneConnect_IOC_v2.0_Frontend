'use client';

import { Empty, Result, Spin } from 'antd';
import React, { useMemo, useState } from 'react';

import { ACTIVE_TERM_UI } from '../constants/uiText';
import { useActiveTerms } from '../hooks/useActiveTerms';
import { TermCard } from './TermCard';
import { UniversityFilter } from './UniversityFilter';

export default function ActiveInternshipTerms() {
  const { data: terms, loading, error } = useActiveTerms();
  const [selectedUniversity, setSelectedUniversity] = useState('ALL');

  // Compute unique universities for the filter
  const universities = useMemo(() => {
    const uniMap = new Map();
    terms.forEach((term) => {
      if (term.universityId) {
        uniMap.set(term.universityId, { id: term.universityId, name: term.universityName });
      }
    });
    return Array.from(uniMap.values());
  }, [terms]);

  // Filter terms by selected university
  const filteredTerms = useMemo(() => {
    if (selectedUniversity === 'ALL' || !selectedUniversity) return terms;
    return terms.filter((term) => term.universityId === selectedUniversity);
  }, [terms, selectedUniversity]);

  if (error) {
    return <Result status="error" title={ACTIVE_TERM_UI.ERROR} subTitle={error.message} />;
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header section with Filter */}
      <header className="flex flex-col gap-6 justify-between lg:flex-row lg:items-end">
        <h1 className="m-0 text-2xl font-bold text-gray-800">{ACTIVE_TERM_UI.TITLE}</h1>
        <UniversityFilter
          value={selectedUniversity}
          onChange={setSelectedUniversity}
          universities={universities}
        />
      </header>

      {/* Main Content List Area */}
      <main className="flex flex-1 flex-col mt-4">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : filteredTerms.length > 0 ? (
          <div className="flex flex-col gap-8">
            {filteredTerms.map((term) => (
              <TermCard key={term.termId}>
                <TermCard.Header
                  title={term.termName}
                  university={term.universityName}
                  status={ACTIVE_TERM_UI.STATUS.ACTIVE}
                  startDate={term.startDate}
                  endDate={term.endDate}
                />

                <TermCard.Dates
                  daysRemaining={term.daysRemaining}
                  progressPercent={term.progressPercent}
                />

                <TermCard.Deadlines
                  startDate={term.startDate}
                  endDate={term.endDate}
                  deadlines={term.deadlines}
                />
              </TermCard>
            ))}
          </div>
        ) : (
          <Empty description={ACTIVE_TERM_UI.EMPTY} className="mt-20" />
        )}
      </main>
    </div>
  );
}
