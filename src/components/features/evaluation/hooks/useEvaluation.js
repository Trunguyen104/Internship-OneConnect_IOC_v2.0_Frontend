'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../services/evaluation.service';

export function useEvaluation() {
  const toast = useToast();

  // --- UI States ---
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [teamVisible, setTeamVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Helper normalize data
  const normalizeArray = (res) => {
    const data = res?.data ?? res ?? [];
    return Array.isArray(data) ? data : [];
  };

  // 1. Fetch Internship Enrollment
  const { data: internshipContext = { id: null, studentId: null } } = useQuery({
    queryKey: ['my-internship-enrollment'],
    queryFn: async () => {
      try {
        const res = await InternshipGroupService.getAll();
        const items = normalizeArray(res);
        if (!items.length) {
          toast.warning('You are not currently enrolled in any internship.');
          return { id: null, studentId: null };
        }
        const active = items.find((it) => it.status !== 'Failed') || items[0];
        return {
          id: active.internshipId || active.id,
          studentId: active.studentId,
        };
      } catch {
        toast.error('Failed to load internship.');
        return { id: null, studentId: null };
      }
    },
    staleTime: Infinity,
  });

  const internshipId = internshipContext.id;
  const myStudentId = internshipContext.studentId;

  // 2. Fetch Evaluation Cycles
  const { data: cycles = [], isLoading: loadingCycles } = useQuery({
    queryKey: ['evaluation-cycles', internshipId],
    queryFn: async () => {
      try {
        const res = await EvaluationService.getStudentEvaluationCycles(internshipId);
        return normalizeArray(res);
      } catch {
        toast.error('Failed to load evaluation cycles.');
        return [];
      }
    },
    enabled: !!internshipId,
    staleTime: 5 * 60 * 1000,
  });

  // 3. Fetch Team Evaluations (Dependent)
  const [teamCycleId, setTeamCycleId] = useState(null);
  const { data: teamData = [], isLoading: loadingTeam } = useQuery({
    queryKey: ['team-evaluations', teamCycleId],
    queryFn: async () => {
      try {
        const res = await EvaluationService.getStudentTeamEvaluations(teamCycleId);
        return normalizeArray(res);
      } catch {
        toast.error('Failed to load team evaluations.');
        return [];
      }
    },
    enabled: !!teamCycleId,
    staleTime: 2 * 60 * 1000,
  });

  // 4. Fetch My Evaluation (Dependent)
  const [myEvalCycleId, setMyEvalCycleId] = useState(null);
  const { data: myEvaluation = null, isLoading: loadingMyEval } = useQuery({
    queryKey: ['my-evaluation-detail', myEvalCycleId],
    queryFn: async () => {
      try {
        const res = await EvaluationService.getStudentMyEvaluation(myEvalCycleId);
        return res?.data ?? res ?? null;
      } catch {
        toast.error('Failed to load evaluation details.');
        return null;
      }
    },
    enabled: !!myEvalCycleId,
    staleTime: 2 * 60 * 1000,
  });

  // Pagination Logic
  const total = cycles.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return cycles.slice(start, start + pageSize);
  }, [cycles, page, pageSize]);

  // Actions
  const openTeamOverview = (cycle) => {
    setSelectedCycle(cycle);
    setTeamVisible(true);
    setTeamCycleId(cycle.cycleId);
  };

  const openDetail = (cycle) => {
    const target = cycle || selectedCycle;
    if (!target) return;

    setSelectedCycle(target);
    setTeamVisible(false);
    setDetailVisible(true);
    setMyEvalCycleId(target.cycleId);
  };

  const closeTeam = () => {
    setTeamVisible(false);
    setTeamCycleId(null);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setMyEvalCycleId(null);
  };

  return {
    loadingCycles,
    loadingTeam,
    loadingMyEval,
    myStudentId,
    paginated,
    total,
    totalPages,
    teamData,
    myEvaluation,
    page,
    pageSize,
    setPage,
    setPageSize,
    selectedCycle,
    teamVisible,
    detailVisible,
    openTeamOverview,
    openDetail,
    closeTeam,
    closeDetail,
  };
}
