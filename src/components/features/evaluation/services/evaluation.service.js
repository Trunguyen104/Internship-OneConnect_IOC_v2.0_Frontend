import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/http-client.service';

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
    return httpGet('/evaluations/criteria', { cycleId });
  },

  createCriteria(cycleId, data) {
    return httpPost(`/evaluations/cycles/${cycleId}/criteria`, data);
  },

  updateCriteria(criteriaId, data) {
    return httpPut(`/evaluations/criteria/${criteriaId}`, data);
  },

  deleteCriteria(criteriaId) {
    return httpDelete(`/evaluations/criteria/${criteriaId}`);
  },

  // --- GRADING ---
  getGradingGrid(cycleId, internshipId) {
    return httpGet(`/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations`);
  },

  batchGrade(cycleId, internshipId, data) {
    return httpPut(`/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations`, data);
  },

  individualGrade(cycleId, data) {
    return httpPost(`/evaluations/cycles/${cycleId}/evaluations/individual`, data);
  },

  submitEvaluations(cycleId, internshipId, data) {
    return httpPatch(
      `/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations/submit`,
      data
    );
  },

  publishEvaluations(cycleId, internshipId, data) {
    return httpPatch(
      `/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations/publish`,
      data
    );
  },

  // --- Student Endpoints (api/students/me prefixed) ---
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
