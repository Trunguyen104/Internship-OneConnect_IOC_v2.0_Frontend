'use client';

import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import InternPhaseDetailView from '@/components/features/intern-phase-management/components/InternPhaseDetailView';
import JobPostingFormModal from '@/components/features/intern-phase-management/components/JobPostingFormModal';
import { InternPhaseService } from '@/components/features/intern-phase-management/services/intern-phase.service';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function PhaseOverviewPage() {
  const { PAGE } = INTERN_PHASE_MANAGEMENT;
  const params = useParams();
  const router = useRouter();
  const id = params.phaseId;

  const [isJobModalVisible, setJobModalVisible] = useState(false);

  const {
    data: phase,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['intern-phase-detail', id],
    queryFn: () => InternPhaseService.getById(id),
    enabled: !!id,
  });

  usePageHeader({
    title: phase?.name || PAGE.TITLE_VIEW || 'Phase Details',
  });

  const handleBack = () => {
    router.push('/company/phases');
  };

  const handleAddPosting = () => {
    setJobModalVisible(true);
  };

  let content = null;
  if (isLoading) {
    content = (
      <div className="flex h-[80vh] items-center justify-center">
        <Spin size="large" description={PAGE.ERROR.LOADING} />
      </div>
    );
  } else if (isError || !phase) {
    content = (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-xl font-bold text-slate-800">{PAGE.ERROR.TITLE}</h2>
        <p className="text-slate-500">{PAGE.ERROR.DESCRIPTION}</p>
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:opacity-90"
        >
          {PAGE.ERROR.BACK_BTN}
        </button>
      </div>
    );
  } else {
    content = (
      <>
        <InternPhaseDetailView phase={phase} onBack={handleBack} onAddPosting={handleAddPosting} />
        <JobPostingFormModal
          visible={isJobModalVisible}
          onCancel={() => setJobModalVisible(false)}
          phase={phase}
        />
      </>
    );
  }

  return <div className="w-full flex-1">{content}</div>;
}
