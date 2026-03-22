import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from '@/services/httpClient';

export const EvaluationService = {
  // --- CYCLES ---
  getCycles(termId) {
    return httpGet('/evaluations/cycles', { termId });
  },

  createCycle(data) {
    return httpPost('/evaluations/cycles', data);
  },

  getCycleById(cycleId) {
    return httpGet(`/evaluations/cycles/${cycleId}`);
  },

  updateCycle(cycleId, data) {
    return httpPut(`/evaluations/cycles/${cycleId}`, data);
  },

  deleteCycle(cycleId) {
    return httpDelete(`/evaluations/cycles/${cycleId}`);
  },

  startCycle(cycleId) {
    return httpPatch(`/evaluations/cycles/${cycleId}/start`);
  },

  completeCycle(cycleId) {
    return httpPatch(`/evaluations/cycles/${cycleId}/complete`);
  },

  // --- CRITERIA ---
  getCriteria(cycleId) {
    return httpGet(`/evaluations/cycles/${cycleId}/criteria`);
  },

  createCriteria(cycleId, data) {
    return httpPost(`/evaluations/cycles/${cycleId}/criteria`, data);
  },

  updateCriteria(cycleId, criteriaId, data) {
    return httpPut(`/evaluations/cycles/${cycleId}/criteria/${criteriaId}`, data);
  },

  deleteCriteria(cycleId, criteriaId) {
    return httpDelete(`/evaluations/cycles/${cycleId}/criteria/${criteriaId}`);
  },

  // --- GRADING ---
  getGradingGrid(cycleId, internshipId) {
    return httpGet(`/evaluations/cycles/${cycleId}/evaluations`, { internshipId });
  },

  batchGrade(cycleId, data) {
    return httpPost(`/evaluations/cycles/${cycleId}/evaluations/batch`, data);
  },

  individualGrade(cycleId, data) {
    return httpPost(`/evaluations/cycles/${cycleId}/evaluations/individual`, data);
  },

  publishEvaluations(cycleId, data) {
    return httpPatch(`/evaluations/cycles/${cycleId}/evaluations/publish`, data);
  },

  // --- STUDENT ---
  getStudentEvaluationCycles(internshipId) {
    return httpGet(`/students/me/internships/${internshipId}/evaluation-cycles`);
  },

  getStudentTeamEvaluations(cycleId) {
    return httpGet(`/students/me/evaluation-cycles/${cycleId}/team-evaluations`);
  },

  getStudentMyEvaluation(cycleId) {
    return httpGet(`/students/me/evaluation-cycles/${cycleId}/my-evaluation`);
  },
};
