import { httpGet, httpPost } from '@/services/http-client.service';

/**
 * Service for handling Uni Admin Placement Management API calls.
 * All endpoints follow the AC-01 to AC-11 requirements.
 */
export const PlacementService = {
  /**
   * Get list of students in the current internship semester with their placement status.
   */
  getSemesterStudents(semesterId, params = {}) {
    return httpGet(`/semesters/${semesterId}/students`, params);
  },

  /**
   * Fetch eligible (Enterprise + Intern Phase) pairs for assignment.
   * Logic: Overlap with semester, Published/Closed jobs, Capacity > 0.
   */
  getEligiblePhases(semesterId, params = {}) {
    return httpGet(`/semesters/${semesterId}/eligible-phases`, params);
  },

  /**
   * AC-01: Assign Enterprise Nhanh Cho 1 Sinh Viên (Inline)
   */
  assignStudent({ studentId, internPhaseId }) {
    return httpPost('/internship-applications/assign', { studentId, internPhaseId });
  },

  /**
   * AC-02: Bulk Assign — Nhiều SV Vào Cùng 1 Enterprise
   */
  bulkAssign({ studentIds, internPhaseId }) {
    return httpPost('/internship-applications/bulk-assign', { studentIds, internPhaseId });
  },

  /**
   * AC-03 & AC-05: Re-assign / Bulk Re-assign
   */
  reassignStudent({ studentIds, internPhaseId }) {
    return httpPost('/internship-applications/reassign', { studentIds, internPhaseId });
  },

  /**
   * AC-04 & AC-06: Unassign / Bulk Unassign
   */
  unassignStudents({ studentIds }) {
    return httpPost('/internship-applications/bulk-unassign', { studentIds });
  },

  /**
   * Check if student has any internship data (logbook, sprint, evaluation)
   */
  checkInternshipData(studentId, semesterId) {
    return httpGet(`/students/${studentId}/semesters/${semesterId}/has-data`);
  },
};
