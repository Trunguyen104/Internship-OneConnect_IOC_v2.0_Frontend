import { httpGet } from '@/services/http-client.service';

export const StudentActivityService = {
  /**
   * Fetch students for a specific term with activity summaries
   * Note: The backend typically provides 'logbookSubmitted', 'totalLogbooks', etc.
   */
  async getStudentActivities(termId, params = {}) {
    // For Uni Admin, we fetch students enrolled in a term
    // The activity summary (logbook, etc.) is either included or fetched separately
    return httpGet(`/universities/me/terms/${termId}/student-activities`, params);
  },

  async getStudentActivityDetail(studentId) {
    // Fetches profile and placement details for Uni Admin
    return httpGet(`/universities/me/students/${studentId}/activity-detail`);
  },

  async getStudentEvaluations(studentId) {
    // Fetches published evaluations (mentor-published)
    return httpGet(`/universities/me/students/${studentId}/published-evaluations`);
  },

  async getStudentViolations(studentId) {
    // Fetches violation reports for the student
    return httpGet(`/universities/me/students/${studentId}/violations`);
  },

  async getUniversityTerms() {
    return httpGet('/universities/me/terms');
  },

  async getEnterprises() {
    return httpGet('/universities/me/enterprises');
  },
};
