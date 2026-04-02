'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../services/evaluation.service';

export function useMentorEvaluation(internshipId, termId) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { MESSAGES } = EVALUATION_UI;

  const [selectedCycle, setSelectedCycle] = useState(null);

  // 1. Fetch Cycles
  const {
    data: cycles = [],
    isLoading: loadingCycles,
    refetch: refetchCycles,
  } = useQuery({
    queryKey: ['evaluation-cycles-mentor', termId],
    queryFn: async () => {
      try {
        const res = await EvaluationService.getCycles(termId);
        return res?.data?.items || res?.data || [];
      } catch (err) {
        toast.error(MESSAGES.FETCH_ERROR);
        throw err;
      }
    },
    enabled: !!termId,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch Criteria
  const {
    data: criteria = [],
    isLoading: loadingCriteria,
    refetch: refetchCriteria,
  } = useQuery({
    queryKey: ['evaluation-criteria', selectedCycle?.cycleId],
    queryFn: async () => {
      try {
        const res = await EvaluationService.getCriteria(selectedCycle.cycleId);
        return res?.data?.items || res?.data || [];
      } catch (err) {
        toast.error(MESSAGES.FETCH_ERROR);
        throw err;
      }
    },
    enabled: !!selectedCycle?.cycleId,
    staleTime: 5 * 60 * 1000,
  });

  // 3. Fetch Grading Grid
  const {
    data: gradingData = { criteria: [], students: [] },
    isLoading: loadingGrading,
    refetch: refetchGrading,
  } = useQuery({
    queryKey: ['evaluation-grading-grid', selectedCycle?.cycleId, internshipId],
    queryFn: async () => {
      try {
        const res = await EvaluationService.getGradingGrid(selectedCycle.cycleId, internshipId);
        return res?.data || { criteria: [], students: [] };
      } catch (err) {
        toast.error(MESSAGES.FETCH_ERROR);
        throw err;
      }
    },
    enabled: !!selectedCycle?.cycleId && !!internshipId,
    staleTime: 2 * 60 * 1000,
  });

  // =========================
  // 🎯 CYCLE ACTIONS
  // =========================

  const handleCreateCycle = async (data) => {
    try {
      await EvaluationService.createCycle({
        ...data,
        termId,
      });
      toast.success(MESSAGES.CREATE_SUCCESS);
      refetchCycles();
      return true;
    } catch (error) {
      if (error.status === 409) {
        toast.error(MESSAGES.CONFLICT_ERROR);
      } else {
        toast.error(error.message || MESSAGES.VALIDATION_ERROR);
      }
      return false;
    }
  };

  const handleUpdateCycle = async (cycleId, data) => {
    try {
      await EvaluationService.updateCycle(cycleId, data);
      toast.success(MESSAGES.UPDATE_SUCCESS);
      refetchCycles();
      return true;
    } catch (error) {
      if (error.status === 409) {
        toast.error(MESSAGES.CONFLICT_ERROR);
      } else {
        toast.error(error.message || MESSAGES.VALIDATION_ERROR);
      }
      return false;
    }
  };

  const handleDeleteCycle = async (cycleId) => {
    try {
      await EvaluationService.deleteCycle(cycleId);
      toast.success(MESSAGES.DELETE_SUCCESS);
      refetchCycles();
      return true;
    } catch (error) {
      toast.error(error.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  const handleCreateCriteria = async (cycleId, data) => {
    try {
      await EvaluationService.createCriteria(cycleId, data);
      toast.success(MESSAGES.CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['evaluation-criteria', cycleId] });
      return true;
    } catch (error) {
      if (error.status === 409) {
        toast.error(MESSAGES.CONFLICT_ERROR);
      } else {
        toast.error(error.message || MESSAGES.VALIDATION_ERROR);
      }
      return false;
    }
  };

  const handleUpdateCriteria = async (cycleId, criteriaId, data) => {
    try {
      await EvaluationService.updateCriteria(criteriaId, data);
      toast.success(MESSAGES.UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['evaluation-criteria', cycleId] });
      return true;
    } catch (error) {
      if (error.status === 409) {
        toast.error(MESSAGES.CONFLICT_ERROR);
      } else {
        toast.error(error.message || MESSAGES.VALIDATION_ERROR);
      }
      return false;
    }
  };

  const handleDeleteCriteria = async (cycleId, criteriaId) => {
    try {
      await EvaluationService.deleteCriteria(criteriaId);
      toast.success(MESSAGES.DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['evaluation-criteria', cycleId] });
      return true;
    } catch (error) {
      toast.error(error.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  const handleSaveEvaluations = async (cycleId, data) => {
    try {
      await EvaluationService.batchGrade(cycleId, internshipId, data);
      toast.success(MESSAGES.GRADE_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ['evaluation-grading-grid', cycleId, internshipId],
      });
      return true;
    } catch (error) {
      toast.error(error.message || MESSAGES.VALIDATION_ERROR);
      return false;
    }
  };

  const handleSubmit = async (cycleId, data) => {
    try {
      await EvaluationService.submitEvaluations(cycleId, internshipId, data);
      toast.success('Submitted successfully');
      queryClient.invalidateQueries({
        queryKey: ['evaluation-grading-grid', cycleId, internshipId],
      });
      return true;
    } catch (error) {
      toast.error(error.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  const handlePublish = async (cycleId, data = {}) => {
    try {
      await EvaluationService.publishEvaluations(cycleId, internshipId, data);
      toast.success(MESSAGES.PUBLISH_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ['evaluation-grading-grid', cycleId, internshipId],
      });
      return true;
    } catch (error) {
      toast.error(error.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  return {
    cycles,
    loadingCycles,
    selectedCycle,
    setSelectedCycle,
    fetchCycles: refetchCycles,

    criteria,
    loadingCriteria,
    fetchCriteria: refetchCriteria,

    gradingData,
    loadingGrading,
    fetchGradingGrid: refetchGrading,

    handleCreateCycle,
    handleUpdateCycle,
    handleDeleteCycle,

    handleCreateCriteria,
    handleUpdateCriteria,
    handleDeleteCriteria,

    handleSaveEvaluations,
    handleSubmit,
    handlePublish,
  };
}
