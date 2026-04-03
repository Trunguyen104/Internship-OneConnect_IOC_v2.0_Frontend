'use client';

import { UserOutlined } from '@ant-design/icons';
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
    <div className="flex-1 overflow-auto p-4 2xl:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
            <UserOutlined className="text-2xl" />
          </div>
          <div>
            <h1 className="mb-0.5 text-2xl font-black tracking-tight text-slate-800">
              {COPY.TITLE}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{COPY.SUB}</p>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
        <InternPhaseStudentTab
          data={students?.items || students?.data}
          loading={isLoading}
          DETAILS={DETAILS}
        />
      </div>
    </div>
  );
}
