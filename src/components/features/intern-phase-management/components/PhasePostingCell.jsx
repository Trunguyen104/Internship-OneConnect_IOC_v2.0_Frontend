'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

import { InternPhaseService } from '../services/intern-phase.service';

/**
 * PhasePostingCell - A component to display the job posting count for a phase.
 * It attempts to use the initial count from the list, but falls back to a
 * separate API call if the initial count is 0 or missing.
 */
export default function PhasePostingCell({ initialCount, phaseId }) {
  // Only enable the query if initialCount is 0 and we have a phaseId
  const shouldFetch = initialCount === 0 && !!phaseId;

  const { data, isLoading } = useQuery({
    queryKey: ['phase-posting-count', phaseId],
    queryFn: async () => {
      try {
        const res = await InternPhaseService.getById(phaseId);

        // mapPhase already calculates jobPostingCount from jobPostings.length
        return res?.jobPostingCount || 0;
      } catch (error) {
        console.error(`Failed to fetch posting count for phase ${phaseId}:`, error);
        return 0;
      }
    },
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (shouldFetch && isLoading) {
    return (
      <span className="animate-pulse text-slate-300 font-medium">
        {INTERN_PHASE_MANAGEMENT.MESSAGES.LOADING_DOTS}
      </span>
    );
  }

  const finalCount = shouldFetch ? (data ?? 0) : initialCount;

  return <span className="font-medium text-slate-700">{finalCount}</span>;
}
