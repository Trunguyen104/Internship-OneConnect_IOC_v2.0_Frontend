import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/httpClient';

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
    // Backend is [HttpGet("criteria")] with [FromQuery] Guid cycleId
    return httpGet('/evaluations/criteria', { cycleId });
  },

  createCriteria(cycleId, data) {
    // Backend is [HttpPost("cycles/{cycleId:guid}/criteria")]
    return httpPost(`/evaluations/cycles/${cycleId}/criteria`, data);
  },

  updateCriteria(criteriaId, data) {
    // Backend is [HttpPut("criteria/{criteriaId:guid}")]
    return httpPut(`/evaluations/criteria/${criteriaId}`, data);
  },

  deleteCriteria(criteriaId) {
    // Backend is [HttpDelete("criteria/{criteriaId:guid}")]
    return httpDelete(`/evaluations/criteria/${criteriaId}`);
  },

  // --- GRADING ---
  getGradingGrid(cycleId, internshipId) {
    // Backend is [HttpGet("cycles/{cycleId:guid}/internships/{internshipId:guid}/evaluations")]
    return httpGet(`/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations`);
  },

  batchGrade(cycleId, internshipId, data) {
    // Backend is [HttpPut("cycles/{cycleId:guid}/internships/{internshipId:guid}/evaluations")]
    // Data contains SaveEvaluationsCommand
    return httpPut(`/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations`, data);
  },

  individualGrade(cycleId, data) {
    // New endpoint to be added to backend (Issue 93)
    return httpPost(`/evaluations/cycles/${cycleId}/evaluations/individual`, data);
  },

  submitEvaluations(cycleId, internshipId, data) {
    // Backend is [HttpPatch("cycles/{cycleId:guid}/internships/{internshipId:guid}/evaluations/submit")]
    // Requires Body according to controller
    return httpPatch(
      `/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations/submit`,
      data
    );
  },

  publishEvaluations(cycleId, internshipId, data) {
    // Backend is [HttpPatch("cycles/{cycleId:guid}/internships/{internshipId:guid}/evaluations/publish")]
    return httpPatch(
      `/evaluations/cycles/${cycleId}/internships/${internshipId}/evaluations/publish`,
      data
    );
  },

  // --- Student Endpoints (api/students/me prefix handled by proxy) ---
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
