'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

/**
 * Hook to manage job selection and modal state for explore-jobs.
 */
export const useJobSelection = (jobs = []) => {
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (id, isApplyRequested) => {
    if (isApplyRequested) {
      setSelectedJobId(id);
      setIsModalOpen(true);
      return;
    }
    router.push(`/explore-jobs/${id}`);
  };

  const selectedJob = useMemo(
    () => jobs.find((j) => (j.jobId || j.id) === selectedJobId),
    [jobs, selectedJobId]
  );

  const closeSelectionModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  return {
    selectedJobId,
    selectedJob,
    isModalOpen,
    setIsModalOpen,
    handleCardClick,
    closeSelectionModal,
  };
};
