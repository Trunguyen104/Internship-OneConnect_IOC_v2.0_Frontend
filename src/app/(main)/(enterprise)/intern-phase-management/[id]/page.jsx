'use client';

import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import InternPhaseDetailView from '@/components/features/intern-phase-management/components/InternPhaseDetailView';
import JobPostingFormModal from '@/components/features/intern-phase-management/components/JobPostingFormModal';
import { InternPhaseService } from '@/components/features/intern-phase-management/services/intern-phase.service';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

export default function InternPhaseDetailPage() {
  const { PAGE } = INTERN_PHASE_MANAGEMENT;
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [isJobModalVisible, setJobModalVisible] = useState(false);

  const {
    data: phase,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['intern-phase-detail', id],
    queryFn: () => InternPhaseService.getById(id),
    enabled: !!id,
  });

  const handleBack = () => {
    router.push('/intern-phase-management');
  };

  const handleAddPosting = () => {
    setJobModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spin size="large" description={PAGE.ERROR.LOADING} />
      </div>
    );
  }

  if (isError || !phase) {
    return (
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
  }

  return (
    <div className="flex flex-col w-full">
      <InternPhaseDetailView phase={phase} onBack={handleBack} onAddPosting={handleAddPosting} />

      <JobPostingFormModal
        visible={isJobModalVisible}
        onCancel={() => setJobModalVisible(false)}
        phase={phase}
      />
    </div>
  );
}
