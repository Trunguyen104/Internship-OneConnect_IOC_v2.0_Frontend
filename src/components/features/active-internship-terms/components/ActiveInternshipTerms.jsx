'use client';

import { Result, Spin } from 'antd';
import React, { useMemo, useState } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { ACTIVE_TERM_UI } from '@/constants/active-internship-terms/uiText';

import { useActiveTerms } from '../hooks/useActiveTerms';
import { TermCard } from './TermCard';
import { UniversityFilter } from './UniversityFilter';

export default function ActiveInternshipTerms() {
  const { data: terms, loading, error } = useActiveTerms();
  const [selectedUniversity, setSelectedUniversity] = useState('ALL');

  const universities = useMemo(() => {
    const uniMap = new Map();
    terms.forEach((term) => {
      if (term.universityId) {
        uniMap.set(term.universityId, { id: term.universityId, name: term.universityName });
      }
    });
    return Array.from(uniMap.values());
  }, [terms]);

  const filteredTerms = useMemo(() => {
    if (selectedUniversity === 'ALL' || !selectedUniversity) return terms;
    return terms.filter((term) => term.universityId === selectedUniversity);
  }, [terms, selectedUniversity]);

  if (error) {
    return (
      <PageLayout>
        <Result status="error" title={ACTIVE_TERM_UI.ERROR} subTitle={error.message} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageLayout.Header title={ACTIVE_TERM_UI.TITLE} subtitle={ACTIVE_TERM_UI.PAGE_SUBTITLE} />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          filterContent={
            <div className="ml-auto shrink-0">
              <UniversityFilter
                value={selectedUniversity}
                onChange={setSelectedUniversity}
                universities={universities}
              />
            </div>
          }
        />

        <PageLayout.Content className="px-0">
          {loading ? (
            <div className="flex flex-1 items-center justify-center p-20">
              <Spin size="large" description="Loading active terms..." />
            </div>
          ) : filteredTerms.length > 0 ? (
            <div className="flex flex-col gap-6">
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
            <div className="flex flex-1 items-center justify-center py-20">
              <p className="text-muted font-medium">{ACTIVE_TERM_UI.EMPTY}</p>
            </div>
          )}
        </PageLayout.Content>
      </PageLayout.Card>
    </PageLayout>
  );
}
