import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMentorEvaluation } from '../useMentorEvaluation';
import { EvaluationService } from '../../services/evaluation.service';

// Mocking dependencies
vi.mock('../../services/evaluation.service', () => ({
  EvaluationService: {
    getCycles: vi.fn(),
    createCycle: vi.fn(),
    getCriteria: vi.fn(),
    getEvaluations: vi.fn(), // ✅ rename đúng BE
    saveEvaluations: vi.fn(), // ✅ thay batch/individual
    publishEvaluations: vi.fn(),
  },
}));

vi.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('useMentorEvaluation', () => {
  const mockInternshipId = 'test-id';
  const mockTermId = 'term-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================
  // 🧪 FETCH CYCLES
  // =========================
  it('fetches cycles when termId is available', async () => {
    const mockCycles = [{ cycleId: 'c1', name: 'Cycle 1' }];
    EvaluationService.getCycles.mockResolvedValue({ data: mockCycles });

    const { result } = renderHook(() => useMentorEvaluation(mockInternshipId, mockTermId));

    await waitFor(() => {
      expect(EvaluationService.getCycles).toHaveBeenCalledWith(mockTermId);
    });

    expect(result.current.cycles).toEqual(mockCycles);
  });

  // =========================
  // 🧪 CREATE CYCLE
  // =========================
  it('creates cycle with termId', async () => {
    const { result } = renderHook(() => useMentorEvaluation(mockInternshipId, mockTermId));

    const newCycle = {
      name: 'New Cycle',
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    };

    EvaluationService.createCycle.mockResolvedValue({
      data: { cycleId: 'c2' },
    });

    await act(async () => {
      const success = await result.current.handleCreateCycle(newCycle);
      expect(success).toBe(true);
    });

    expect(EvaluationService.createCycle).toHaveBeenCalledWith({
      ...newCycle,
      termId: mockTermId,
    });
  });

  // =========================
  // 🧪 FETCH CRITERIA
  // =========================
  it('fetches criteria by cycleId', async () => {
    const mockCriteria = [{ id: 'cr1', name: 'Criteria 1' }];
    EvaluationService.getCriteria.mockResolvedValue({ data: mockCriteria });

    const { result } = renderHook(() => useMentorEvaluation(mockInternshipId, mockTermId));

    await act(async () => {
      await result.current.fetchCriteria('cycle-1');
    });

    expect(EvaluationService.getCriteria).toHaveBeenCalledWith('cycle-1');
    expect(result.current.criteria).toEqual(mockCriteria);
  });

  // =========================
  // 🧪 FETCH GRADING GRID
  // =========================
  it('fetches evaluations grid', async () => {
    const mockGrid = { criteria: [], students: [] };

    EvaluationService.getEvaluations.mockResolvedValue({
      data: mockGrid,
    });

    const { result } = renderHook(() => useMentorEvaluation(mockInternshipId, mockTermId));

    await act(async () => {
      await result.current.fetchGradingGrid('cycle-1');
    });

    expect(EvaluationService.getEvaluations).toHaveBeenCalledWith('cycle-1', mockInternshipId);

    expect(result.current.gradingData).toEqual(mockGrid);
  });

  // =========================
  // 🧪 SAVE EVALUATIONS
  // =========================
  it('saves evaluations (upsert)', async () => {
    EvaluationService.saveEvaluations.mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useMentorEvaluation(mockInternshipId, mockTermId));

    const payload = { evaluations: [] };

    await act(async () => {
      const success = await result.current.handleSaveEvaluations('cycle-1', payload);
      expect(success).toBe(true);
    });

    expect(EvaluationService.saveEvaluations).toHaveBeenCalledWith(
      'cycle-1',
      mockInternshipId,
      payload,
    );
  });

  // =========================
  // 🧪 PUBLISH
  // =========================
  it('publishes evaluations', async () => {
    EvaluationService.publishEvaluations.mockResolvedValue({});

    const { result } = renderHook(() => useMentorEvaluation(mockInternshipId, mockTermId));

    await act(async () => {
      const success = await result.current.handlePublish('cycle-1');
      expect(success).toBe(true);
    });

    expect(EvaluationService.publishEvaluations).toHaveBeenCalledWith('cycle-1', mockInternshipId);
  });
});
