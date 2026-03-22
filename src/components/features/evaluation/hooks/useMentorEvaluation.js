'use client';

import { useState, useCallback, useEffect } from 'react';
import { EvaluationService } from '../services/evaluation.service';
import { useToast } from '@/providers/ToastProvider';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export function useMentorEvaluation(internshipId, termId) {
  const toast = useToast();
  const { MESSAGES } = EVALUATION_UI;

  // --- Cycles ---
  const [cycles, setCycles] = useState([]);
  const [loadingCycles, setLoadingCycles] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);

  // --- Criteria ---
  const [criteria, setCriteria] = useState([]);
  const [loadingCriteria, setLoadingCriteria] = useState(false);

  // --- Grading ---
  const [gradingData, setGradingData] = useState({
    criteria: [],
    students: [],
  });
  const [loadingGrading, setLoadingGrading] = useState(false);

  const fetchCycles = useCallback(async () => {
    if (!termId) return;

    try {
      setLoadingCycles(true);
      const res = await EvaluationService.getCycles(termId);
      setCycles(res?.data || []);
    } catch {
      toast.error(MESSAGES.FETCH_ERROR);
    } finally {
      setLoadingCycles(false);
    }
  }, [termId, toast, MESSAGES.FETCH_ERROR]);

  const fetchCriteria = useCallback(
    async (cycleId) => {
      if (!cycleId) return;

      try {
        setLoadingCriteria(true);
        const res = await EvaluationService.getCriteria(cycleId);
        setCriteria(res?.data || []);
      } catch {
        toast.error(MESSAGES.FETCH_ERROR);
      } finally {
        setLoadingCriteria(false);
      }
    },
    [toast, MESSAGES.FETCH_ERROR],
  );

  const fetchGradingGrid = useCallback(
    async (cycleId) => {
      if (!cycleId || !internshipId) return;

      try {
        setLoadingGrading(true);
        const res = await EvaluationService.getEvaluations(cycleId, internshipId);
        setGradingData(res?.data || { criteria: [], students: [] });
      } catch {
        toast.error(MESSAGES.FETCH_ERROR);
      } finally {
        setLoadingGrading(false);
      }
    },
    [internshipId, toast, MESSAGES.FETCH_ERROR],
  );

  useEffect(() => {
    if (termId) fetchCycles();
  }, [termId, fetchCycles]);

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
      fetchCycles();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.VALIDATION_ERROR);
      return false;
    }
  };

  const handleUpdateCycle = async (cycleId, data) => {
    try {
      await EvaluationService.updateCycle(cycleId, data);
      toast.success(MESSAGES.UPDATE_SUCCESS);
      fetchCycles();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.VALIDATION_ERROR);
      return false;
    }
  };

  const handleDeleteCycle = async (cycleId) => {
    try {
      await EvaluationService.deleteCycle(cycleId);
      toast.success(MESSAGES.DELETE_SUCCESS);
      fetchCycles();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  const handleCreateCriteria = async (cycleId, data) => {
    try {
      await EvaluationService.createCriteria(cycleId, data);
      toast.success(MESSAGES.CREATE_SUCCESS);
      fetchCriteria(cycleId);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.VALIDATION_ERROR);
      return false;
    }
  };

  const handleUpdateCriteria = async (cycleId, criteriaId, data) => {
    try {
      // FIX: chỉ truyền criteriaId
      await EvaluationService.updateCriteria(criteriaId, data);
      toast.success(MESSAGES.UPDATE_SUCCESS);
      fetchCriteria(cycleId);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.VALIDATION_ERROR);
      return false;
    }
  };

  const handleDeleteCriteria = async (cycleId, criteriaId) => {
    try {
      await EvaluationService.deleteCriteria(criteriaId);
      toast.success(MESSAGES.DELETE_SUCCESS);
      fetchCriteria(cycleId);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  const handleSaveEvaluations = async (cycleId, data) => {
    try {
      await EvaluationService.saveEvaluations(cycleId, internshipId, data);
      toast.success(MESSAGES.GRADE_SUCCESS);
      fetchGradingGrid(cycleId);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.VALIDATION_ERROR);
      return false;
    }
  };

  const handleSubmit = async (cycleId, data) => {
    try {
      await EvaluationService.submitEvaluations(cycleId, internshipId, data);
      toast.success('Submitted successfully');
      fetchGradingGrid(cycleId);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  const handlePublish = async (cycleId) => {
    try {
      await EvaluationService.publishEvaluations(cycleId, internshipId);
      toast.success(MESSAGES.PUBLISH_SUCCESS);
      fetchGradingGrid(cycleId);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || MESSAGES.FETCH_ERROR);
      return false;
    }
  };

  return {
    cycles,
    loadingCycles,
    selectedCycle,
    setSelectedCycle,
    fetchCycles,

    criteria,
    loadingCriteria,
    fetchCriteria,

    gradingData,
    loadingGrading,
    fetchGradingGrid,

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
