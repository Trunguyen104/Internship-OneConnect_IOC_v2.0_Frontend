'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../services/evaluation.service';

export function useEvaluation() {
  const toast = useToast();

  // --- Core State ---
  const [internshipId, setInternshipId] = useState(null);
  const [myStudentId, setMyStudentId] = useState(null);

  // --- Cycles ---
  const [cycles, setCycles] = useState([]);
  const [loadingCycles, setLoadingCycles] = useState(false);

  // --- Team ---
  const [teamData, setTeamData] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // --- My Evaluation ---
  const [myEvaluation, setMyEvaluation] = useState(null);
  const [loadingMyEval, setLoadingMyEval] = useState(false);

  // --- UI ---
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [teamVisible, setTeamVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // =========================
  // ðŸ”§ Helper normalize data
  // =========================
  const normalizeArray = (res) => {
    const data = res?.data ?? res ?? [];
    return Array.isArray(data) ? data : [];
  };

  // =========================
  // 1. Fetch Internship
  // =========================
  const fetchInternship = useCallback(async () => {
    try {
      const res = await InternshipGroupService.getAll();
      const items = normalizeArray(res);

      if (!items.length) {
        toast.warning('You are not currently enrolled in any internship.');
        return;
      }

      const active = items.find((it) => it.status !== 'Failed') || items[0];

      setInternshipId(active.internshipId || active.id);
      setMyStudentId(active.studentId);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load internship.');
    }
  }, [toast]);

  // =========================
  // 2. Fetch Cycles
  // =========================
  const fetchCycles = useCallback(async () => {
    if (!internshipId) return;

    try {
      setLoadingCycles(true);
      const res = await EvaluationService.getStudentEvaluationCycles(internshipId);
      setCycles(normalizeArray(res));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load evaluation cycles.');
    } finally {
      setLoadingCycles(false);
    }
  }, [internshipId, toast]);

  // =========================
  // 3. Fetch Team
  // =========================
  const fetchTeamData = useCallback(
    async (cycleId) => {
      try {
        setLoadingTeam(true);
        const res = await EvaluationService.getStudentTeamEvaluations(cycleId);
        setTeamData(normalizeArray(res));
      } catch (error) {
        console.error(error);
        toast.error('Failed to load team evaluations.');
      } finally {
        setLoadingTeam(false);
      }
    },
    [toast]
  );

  // =========================
  // 4. Fetch My Evaluation
  // =========================
  const fetchMyEvalData = useCallback(
    async (cycleId) => {
      try {
        setLoadingMyEval(true);
        const res = await EvaluationService.getStudentMyEvaluation(cycleId);
        setMyEvaluation(res?.data ?? res ?? null);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load evaluation details.');
      } finally {
        setLoadingMyEval(false);
      }
    },
    [toast]
  );

  // =========================
  // ðŸ” Effects
  // =========================
  useEffect(() => {
    fetchInternship();
  }, [fetchInternship]);

  useEffect(() => {
    if (internshipId) fetchCycles();
  }, [internshipId, fetchCycles]);

  // =========================
  // ðŸ“„ Pagination
  // =========================
  const total = cycles.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return cycles.slice(start, start + pageSize);
  }, [cycles, page, pageSize]);

  // =========================
  // ðŸŽ¯ Actions
  // =========================
  const openTeamOverview = (cycle) => {
    setSelectedCycle(cycle);
    setTeamVisible(true);
    fetchTeamData(cycle.cycleId);
  };

  const openDetail = (cycle) => {
    const target = cycle || selectedCycle;
    if (!target) return;

    setSelectedCycle(target);
    setTeamVisible(false);
    setDetailVisible(true); // âŒ bá» setTimeout

    fetchMyEvalData(target.cycleId);
  };

  const closeTeam = () => setTeamVisible(false);
  const closeDetail = () => setDetailVisible(false);

  // =========================
  // ðŸš€ Return
  // =========================
  return {
    // loading
    loadingCycles,
    loadingTeam,
    loadingMyEval,

    // data
    myStudentId,
    paginated,
    total,
    totalPages,
    teamData,
    myEvaluation,

    // pagination
    page,
    pageSize,
    setPage,
    setPageSize,

    // UI
    selectedCycle,
    teamVisible,
    detailVisible,

    // actions
    openTeamOverview,
    openDetail,
    closeTeam,
    closeDetail,
  };
}
