import { httpGet, httpPatch } from '@/services/http-client.service';

export const studentApplicationService = {
  /**
   * Get list of applications for the logged-in student.
   * @param {Object} params - Query parameters.
   */
  getMyApplications(params = {}) {
    return httpGet('/studentapplications/my-applications', params);
  },

  /**
   * Get detail of a specific application.
   * @param {string} id
   */
  getById(id) {
    return httpGet(`/studentapplications/my-applications/${id}`);
  },

  /**
   * Withdraw an application.
   * @param {string} id
   */
  withdraw(id) {
    return httpPatch(`/studentapplications/my-applications/${id}/withdraw`);
  },

  /**
   * Hide an application from view.
   * @param {string} id
   */
  hide(id) {
    return httpPatch(`/studentapplications/my-applications/${id}/hide`);
  },
};
