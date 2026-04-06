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
   * Get students with precise placement status grouped by term.
   * Path: /api/v1/uniassigns/students-by-term
   */
  getStudentsByTerm(params = {}) {
    const { termId, pageNumber, pageSize } = params;
    return httpGet('/uniassigns/students-by-term', {
      TermId: termId,
      PageNumber: pageNumber || 1,
      PageSize: pageSize || 10,
    });
  },

  /**
   * Fetch eligible (Enterprise + Intern Phase) pairs for assignment.
   * Path: /api/v1/uniassigns/enterprise-interphases
   */
  getEligiblePhases(params = {}) {
    return httpGet('/uniassigns/enterprise-interphases', params);
  },

  /**
   * AC-01: Uni Admin quick assign: create a PendingAssignment for a single student (inline).
   * Path: /api/v1/uniassigns/quick-enterprise-assignment
   */
  assignStudent(command) {
    return httpPost('/uniassigns/quick-enterprise-assignment', command);
  },

  /**
   * AC-06: Uni Admin unassign: withdraw a pending or placed uni-assign.
   * Path: /api/v1/uniassigns/unassign-single
   */
  unassignSingle(command) {
    return httpPost('/uniassigns/unassign-single', command);
  },

  /**
   * AC-05: Uni Admin reassign: change enterprise for a student's uni-assign.
   * Path: /api/v1/uniassigns/reassign-single
   */
  reassignSingle(command) {
    return httpPost('/uniassigns/reassign-single', command);
  },

  /**
   * AC-02: Bulk assign multiple students to the same enterprise/phase.
   * Path: /api/v1/uniassigns/bulk-enterprise-assignment
   */
  bulkAssign(command) {
    return httpPost('/uniassigns/bulk-enterprise-assignment', command);
  },

  /**
   * AC-03: Bulk re-assign multiple students to a new enterprise/phase.
   * Path: /api/v1/uniassigns/bulk-reassign-enterprise
   */
  reassignStudents(command) {
    return httpPost('/uniassigns/bulk-reassign-enterprise', command);
  },

  /**
   * AC-04: Bulk unassign/withdraw placement for multiple students.
   * Path: /api/v1/uniassigns/bulk-unassign
   */
  unassignStudents(command) {
    return httpPost('/uniassigns/bulk-unassign', command);
  },
};
