import { httpGet } from '@/services/http-client.service';

const BASE_URL = '/uni-admin/internship/students';

export const StudentActivityService = {
  /**
   * Fetch students for a specific term with activity summaries
   * Note: The backend typically provides 'logbookSubmitted', 'totalLogbooks', etc.
   */
  async getStudentActivities(params = {}) {
    return httpGet(BASE_URL, params);
  },

  async getStudentActivityDetail(studentId, termId = null) {
    const params = termId ? { termId } : {};
    return httpGet(`${BASE_URL}/${studentId}`, params);
  },

  async getStudentEvaluations(studentId, termId = null) {
    const params = termId ? { termId } : {};
    return httpGet(`${BASE_URL}/${studentId}/evaluations`, params);
  },

  async getStudentLogbookTotal(studentId, termId = null) {
    const params = termId ? { termId } : {};
    return httpGet(`${BASE_URL}/${studentId}/logbook/total`, params);
  },

  async getStudentLogbookWeekly(studentId, termId = null) {
    const params = termId ? { termId } : {};
    return httpGet(`${BASE_URL}/${studentId}/logbook/weekly`, params);
  },

  async getStudentViolations(studentId, termId = null) {
    const params = termId ? { termId } : {};
    return httpGet(`${BASE_URL}/${studentId}/violations`, params);
  },

  async getUniversityTerms() {
    return httpGet('/terms');
  },

  async getEnterprises() {
    return httpGet('/enterprises');
  },
};
