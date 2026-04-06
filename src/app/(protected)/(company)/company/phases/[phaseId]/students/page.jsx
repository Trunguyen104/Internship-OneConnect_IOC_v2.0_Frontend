'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

import InternPhaseStudentTab from '@/components/features/intern-phase-management/components/InternPhaseStudentTab';
import { InternPhaseService } from '@/components/features/intern-phase-management/services/intern-phase.service';
import PageLayout from '@/components/ui/pagelayout';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

const COPY = {
  TITLE: 'Students',
  SUB: 'All students participating in this internship phase.',
};

export default function PhaseStudentsPage() {
  const { phaseId } = useParams();
  const { DETAILS } = INTERN_PHASE_MANAGEMENT;

  const { data: students, isLoading } = useQuery({
    queryKey: ['phase-students', phaseId],
    queryFn: () => InternPhaseService.getStudents(phaseId),
    enabled: !!phaseId,
  });

  return (
    <PageLayout>
      <PageLayout.Header title={COPY.TITLE} subtitle={COPY.SUB} />
      <PageLayout.Card className="flex flex-col overflow-hidden p-6 py-4">
        <PageLayout.Content className="flex flex-col max-h-[450px] overflow-hidden px-0">
          <InternPhaseStudentTab
            data={students?.data || students?.items || (Array.isArray(students) ? students : [])}
            loading={isLoading}
            DETAILS={DETAILS}
          />
        </PageLayout.Content>
      </PageLayout.Card>
    </PageLayout>
  );
}
