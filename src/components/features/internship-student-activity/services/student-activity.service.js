import { httpGet } from '@/services/http-client.service';

export const StudentActivityService = {
  /**
   * Fetch students for a specific term with activity summaries
   * Note: The backend typically provides 'logbookSubmitted', 'totalLogbooks', etc.
   */
  async getStudentActivities(params = {}) {
    // For Uni Admin, we fetch students enrolled in a term
    return httpGet('/uni-admin/internship/students', params);
  },

  async getStudentActivityDetail(studentId, termId = null) {
    // Fetches profile and placement details for Uni Admin
    const params = termId ? { termId } : {};
    return httpGet(`/uni-admin/internship/students/${studentId}`, params);
  },

  async getStudentEvaluations(studentId, termId = null) {
    // Fetches published evaluations (mentor-published)
    const params = termId ? { termId } : {};
    return httpGet(`/uni-admin/internship/students/${studentId}/evaluations`, params);
  },

  async getStudentViolations(studentId, termId = null) {
    // Fetches violation reports for the student
    const params = termId ? { termId } : {};
    return httpGet(`/uni-admin/internship/students/${studentId}/violations`, params);
  },

  async getUniversityTerms() {
    return httpGet('/terms');
  },

  async getEnterprises() {
    return httpGet('/enterprises');
  },
};
