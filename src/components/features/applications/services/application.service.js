import { httpGet, httpPatch } from '@/services/http-client.service';

/**
 * Service for handling HR Application Management API calls.
 * All endpoints match the Swagger documentation for IOCv2 Enterprise.
 */
export const ApplicationService = {
  /**
   * Get list of self-applied internship applications.
   * @param {Object} params - Query parameters (status, search, jobId, schoolId, includeTerminal, page, size)
   */
  getSelfApplyList(params = {}) {
    return httpGet('/applications/self-apply', params);
  },

  /**
   * Get list of uni-assigned internship applications.
   * @param {Object} params - Query parameters (search, status, jobId, schoolId, includeTerminal, page, size)
   */
  getUniAssignList(params = {}) {
    return httpGet('/applications/uni-assign', params);
  },

  /**
   * Get detailed information for a specific application.
   * @param {string|number} id - Application ID
   */
  getById(id) {
    return httpGet(`/applications/${id}`);
  },

  /**
   * Self-apply Flow: Move application to Interviewing stage.
   * @param {string|number} id - Application ID
   */
  moveToInterviewing(id) {
    return httpPatch(`/applications/${id}/move-to-interviewing`);
  },

  /**
   * Self-apply Flow: Send an offer to the student.
   * @param {string|number} id - Application ID
   */
  sendOffer(id) {
    return httpPatch(`/applications/${id}/send-offer`);
  },

  /**
   * Self-apply Flow: Mark the application as placed (officially hired).
   * @param {string|number} id - Application ID
   */
  markAsPlaced(id) {
    return httpPatch(`/applications/${id}/mark-as-placed`);
  },

  /**
   * Universal: Reject an application.
   * @param {string|number} id - Application ID
   * @param {Object} data - Contains mandatory 'rejectReason' for rejection.
   */
  reject(id, data) {
    return httpPatch(`/applications/${id}/reject`, data);
  },

  /**
   * Uni-Assign Flow: HR approves the assignment.
   * @param {string|number} id - Application ID
   */
  approveUniAssign(id) {
    return httpPatch(`/applications/${id}/approve-uni-assign`);
  },

  /**
   * Uni-Assign Flow: HR rejects the assignment.
   * @param {string|number} id - Application ID
   * @param {Object} data - Contains mandatory 'rejectReason' for rejection.
   */
  rejectUniAssign(id, data) {
    return httpPatch(`/applications/${id}/reject-uni-assign`, data);
  },

  /**
   * Get list of applications for the logged-in student.
   * @param {Object} params - Query parameters (status, search, page, size)
   */
  getStudentApplications(params = {}) {
    return httpGet('/studentapplications/my-applications', params);
  },
};
