import { httpGet, httpPost } from '@/services/http-client.service';

/**
 * Service for handling Uni Admin Placement Management API calls.
 * All endpoints follow the AC-01 to AC-11 requirements.
 */
export const PlacementService = {
  /**
   * Get list of students in the current internship semester (term) with their placement status.
   * Path: /api/v1/terms/{termId}/enrollments
   * Note: Using Enrollment endpoint as it is the standard for student lists in a term.
   */
  /**
   * Fetch all Uni Admin Assignment applications (pending/history).
   * Path: /applications/uni-assign
   */
  getUniAssignApplications(params = {}) {
    return httpGet('/applications/uni-assign', params);
  },

  /**
   * Fetch eligible (Enterprise + Intern Phase) pairs for assignment.
   * Path: /api/v1/uniassigns/enterprise-interphase
   */
  getEligiblePhases(params = {}) {
    return httpGet('/uniassigns/enterprise-interphase', params);
  },

  /**
   * AC-01: Uni Admin quick assign: create a PendingAssignment for a single student (inline).
   * Path: /api/v1/uniassigns/uni-assign
   */
  assignStudent(command) {
    return httpPost('/uniassigns/uni-assign', command);
  },

  /**
   * AC-06: Uni Admin unassign: withdraw a pending or placed uni-assign.
   * Path: /api/v1/uniassigns/unassign-single
   * Body: { applicationId: string }
   */
  unassignSingle(applicationId) {
    return httpPost('/uniassigns/unassign-single', { applicationId });
  },

  /**
   * AC-05: Uni Admin reassign: change enterprise for a student's uni-assign.
   * Path: /api/v1/uniassigns/reassign-single
   */
  reassignSingle(command) {
    return httpPost('/uniassigns/reassign-single', command);
  },

  /**
   * Check if student has any internship data (logbook, sprint, evaluation)
   */
  checkInternshipData(studentId, semesterId) {
    return httpGet(`/students/${studentId}/semesters/${semesterId}/has-data`);
  },
};
