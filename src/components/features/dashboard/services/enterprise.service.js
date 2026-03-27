import { httpGet, httpPut } from '@/services/http-client.service';

export const enterpriseService = {
  /**
   * Get the HR/Enterprise profile data
   */
  getEnterpriseHRProfile() {
    return httpGet('/enterprises/mine');
  },

  /**
   * Update the Enterprise profile
   * @param {string} enterpriseId
   * @param {Object} payload
   * @returns
   */
  updateEnterpriseProfile(enterpriseId, payload) {
    return httpPut(`/enterprises/${enterpriseId}`, payload);
  },
};
