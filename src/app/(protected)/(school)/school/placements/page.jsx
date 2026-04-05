'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import StudentInternshipTable from '@/components/features/internship-placement/components/StudentInternshipTable';
import { TermService } from '@/components/features/internship-term-management/services/term.service';
import SchoolTopNav from '@/components/layout/SchoolTopNav';
import PageLayout from '@/components/ui/pagelayout';
import {
  PLACEMENT_UI_TEXT,
  SEMESTER_STATUS,
} from '@/constants/internship-placement/placement.constants';

export default function PlacementPage() {
  const [selectedTermId, setSelectedTermId] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const UI = PLACEMENT_UI_TEXT.PAGE;

  // Fetch all terms
  const { data: termsRes, isLoading: isLoadingTerms } = useQuery({
    queryKey: ['school-terms'],
    queryFn: () => TermService.getAll({ PageSize: 100 }),
  });

  const terms = termsRes?.data?.items || termsRes?.items || [];

  // Determine current term
  const defaultTermId =
    terms.length > 0
      ? (terms.find((t) => t.status === SEMESTER_STATUS.ACTIVE) || terms[0]).termId || terms[0].id
      : undefined;

  const currentTermId = selectedTermId || defaultTermId;
  const currentTerm = terms.find((t) => (t.termId || t.id) === currentTermId);

  return (
    <PageLayout>
      <SchoolTopNav />

      <PageLayout.Header title={UI.TITLE} subtitle={UI.SUBTITLE} />

      <PageLayout.Card className="flex flex-1 flex-col overflow-hidden min-h-[500px]">
        <PageLayout.Content className="px-0 flex flex-col flex-1">
          {currentTermId ? (
            <StudentInternshipTable
              semesterId={currentTermId}
              semesterStatus={currentTerm?.status}
              termName={currentTerm?.name}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              terms={terms}
              isLoadingTerms={isLoadingTerms}
              onTermChange={setSelectedTermId}
            />
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center p-8">
              <div className="max-w-md space-y-2">
                <div className="text-slate-300 text-5xl mb-4">{UI.EMPTY_STATE.ICON}</div>
                <h3 className="text-lg font-bold text-slate-700">{UI.EMPTY_STATE.TITLE}</h3>
                <p className="text-sm text-slate-500">{UI.EMPTY_STATE.DESC}</p>
              </div>
            </div>
          )}
        </PageLayout.Content>
      </PageLayout.Card>
    </PageLayout>
  );
}
