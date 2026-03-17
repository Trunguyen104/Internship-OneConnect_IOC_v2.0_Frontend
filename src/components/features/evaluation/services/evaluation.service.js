import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from '@/services/httpClient';

export const EvaluationService = {
  // --- Cycle Endpoints ---
  getCycles(params = {}) {
    return httpGet('/evaluations/cycles', params);
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

  // --- Criteria Endpoints ---
  getCriteria(params = {}) {
    return httpGet('/evaluations/criteria', params);
  },

  createCriteria(data) {
    return httpPost('/evaluations/criteria', data);
  },

  updateCriteria(criteriaId, data) {
    return httpPut(`/evaluations/criteria/${criteriaId}`, data);
  },

  deleteCriteria(criteriaId) {
    return httpDelete(`/evaluations/criteria/${criteriaId}`);
  },

  // --- Evaluations Endpoints ---
  getEvaluationsForInternship(cycleId, internshipId) {
    return httpGet(`/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations`);
  },

  updateEvaluationsForInternship(cycleId, internshipId, data) {
    return httpPut(`/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations`, data);
  },

  updateEvaluationById(evaluationId, data) {
    return httpPut(`/evaluations/evaluations/${evaluationId}`, data);
  },

  submitEvaluations(cycleId, internshipId) {
    return httpPatch(
      `/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations/submit`,
    );
  },

  publishEvaluations(cycleId, internshipId) {
    return httpPatch(
      `/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations/publish`,
    );
  },

  // --- Student Endpoints ---
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
