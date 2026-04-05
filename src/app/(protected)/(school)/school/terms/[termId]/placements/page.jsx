'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import StudentInternshipTable from '@/components/features/internship-placement/components/StudentInternshipTable';
import { TermService } from '@/components/features/internship-term-management/services/term.service';
import PageLayout from '@/components/ui/pagelayout';
import { PLACEMENT_UI_TEXT } from '@/constants/internship-placement/placement.constants';

export default function TermPlacementsPage() {
  const { termId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const UI = PLACEMENT_UI_TEXT.PAGE;

  // Fetch specific term details
  const { data: termRes, isLoading: isLoadingTerm } = useQuery({
    queryKey: ['school-term', termId],
    queryFn: () => TermService.getById(termId),
    enabled: !!termId,
  });

  const term = termRes?.data || termRes;

  return (
    <PageLayout>
      <PageLayout.Header
        title={`${UI.TITLE} — ${term?.name || '...'}`}
        subtitle={`Manage student internship placements for the ${term?.name || 'current'} semester.`}
      />

      <PageLayout.Card className="flex flex-1 flex-col overflow-hidden min-h-[500px]">
        <PageLayout.Content className="px-0 flex flex-col flex-1">
          <StudentInternshipTable
            semesterId={termId}
            semesterStatus={term?.status}
            termName={term?.name}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            terms={term ? [term] : []}
            isLoadingTerms={isLoadingTerm}
            hideTermSelect={true}
          />
        </PageLayout.Content>
      </PageLayout.Card>
    </PageLayout>
  );
}
