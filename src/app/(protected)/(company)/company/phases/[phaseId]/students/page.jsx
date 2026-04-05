'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

import InternPhaseStudentTab from '@/components/features/intern-phase-management/components/InternPhaseStudentTab';
import { InternPhaseService } from '@/components/features/intern-phase-management/services/intern-phase.service';
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
    <div className="flex-1 overflow-auto p-4 2xl:p-8 flex flex-col">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex-1 flex flex-col">
        <InternPhaseStudentTab
          data={students?.data || students?.items || (Array.isArray(students) ? students : [])}
          loading={isLoading}
          DETAILS={DETAILS}
        />
      </div>
    </div>
  );
}
