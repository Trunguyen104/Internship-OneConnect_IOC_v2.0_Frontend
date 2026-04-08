'use client';

import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useInternshipPhases, useJobPostingActions, useJobPostingDetail } from './useJobPostings';
import { useJobPostingsActionsHandler } from './useJobPostingsActionsHandler';

/**
 * Custom hook to manage the state and derived logic for the Job Posting Detail page.
 * Extracts business logic from the UI component for better maintainability.
 *
 * @returns {Object} An object containing job detail, loading state, application summaries, phase info, and action handlers.
 */
export function useJobPostingDetailState() {
  const { id } = useParams();
  const router = useRouter();
  const { jobDetail: job, isLoading } = useJobPostingDetail(id);
  const { phases } = useInternshipPhases();
  const actions = useJobPostingActions();

  const { isDrawerOpen, selectedRecord, onAction, closeDrawer } = useJobPostingsActionsHandler({
    actions,
  });

  // Calculate application status totals
  const { applicationsSummary, totalApplications } = useMemo(() => {
    if (!job) return { applicationsSummary: {}, totalApplications: 0 };

    const summary = {};
    let total = 0;

    (job.applicationStatusCounts || []).forEach((item) => {
      summary[item.status] = item.count;
      total += item.count;
    });

    return { applicationsSummary: summary, totalApplications: total };
  }, [job]);

  // Lookup Phase Info from the master list
  const phaseInfo = useMemo(() => {
    if (!job?.internshipPhaseId || !phases) return null;
    return phases.find((p) => {
      const pId = p.internshipPhaseId || p.phaseId || p.id;
      return pId?.toString().toLowerCase() === job.internshipPhaseId.toString().toLowerCase();
    });
  }, [job, phases]);

  // Determine if the associated phase has reached maximum capacity
  const { isPhaseFull, placedCount, totalCapacity } = useMemo(() => {
    if (!phaseInfo) return { isPhaseFull: false, placedCount: 0, totalCapacity: 0 };

    const total = phaseInfo.capacity || 0;
    const remaining = phaseInfo.remainingCapacity ?? total;
    const placed = total - remaining;

    return {
      isPhaseFull: total > 0 && remaining <= 0,
      placedCount: placed,
      totalCapacity: total,
    };
  }, [phaseInfo]);

  const displayPhaseName = job?.termName || job?.internshipPhaseName || phaseInfo?.name || 'N/A';

  // Format valid phase dates or fallback to phase defaults
  const displayPhaseDates = useMemo(() => {
    const isInvalid = (d) => !d || dayjs(d).year() <= 1901;

    const start = isInvalid(job?.startDate) ? phaseInfo?.startDate : job?.startDate;
    const end = isInvalid(job?.endDate) ? phaseInfo?.endDate : job?.endDate;

    if (isInvalid(start) || isInvalid(end)) return null;

    return `${dayjs(start).format('MMM D')} \u2014 ${dayjs(end).format('MMM D, YYYY')}`;
  }, [job?.startDate, job?.endDate, phaseInfo]);

  /**
   * Helper to execute predefined job actions (publish, edit, delete, etc.)
   * @param {string} key - The action key.
   */
  const handleAction = (key) => {
    if (job) onAction(key, job);
  };

  return {
    job,
    isLoading,
    router,
    isDrawerOpen,
    selectedRecord,
    closeDrawer,
    applicationsSummary,
    totalApplications,
    isPhaseFull,
    placedCount,
    totalCapacity,
    displayPhaseName,
    displayPhaseDates,
    handleAction,
    phases,
  };
}
