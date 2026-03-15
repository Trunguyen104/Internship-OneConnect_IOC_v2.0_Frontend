import { httpGet, httpPut } from '@/services/httpClient';

export const enterpriseService = {
  /**
   * Get the HR/Enterprise profile data
   */
  getEnterpriseHRProfile() {
    return httpGet('/Enterprises/HR');
  },

  /**
   * Update the Enterprise profile
   * @param {string} enterpriseId
   * @param {Object} payload
   * @returns
   */
  updateEnterpriseProfile(enterpriseId, payload) {
    return httpPut(`/Enterprises/${enterpriseId}`, payload);
  },
};
