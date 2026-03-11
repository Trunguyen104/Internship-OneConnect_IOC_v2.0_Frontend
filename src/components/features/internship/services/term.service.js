import { httpGet, httpPost, httpPut, httpPatch, httpDelete } from '@/services/httpClient';

export const TermService = {
  /**
   * Get paginated list of terms
   * @param {Object} params - { searchTerm, status, pageIndex, pageSize }
   */
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/terms${query ? `?${query}` : ''}`);
  },

  /**
   * Create a new term
   * @param {Object} data - { name, startDate, endDate, status }
   */
  create(data) {
    return httpPost('/terms', data);
  },

  /**
   * Update term details
   * @param {string|number} termId
   * @param {Object} data - { name, startDate, endDate }
   */
  update(termId, data) {
    return httpPut(`/terms/${termId}`, data);
  },

  /**
   * Change status of a term (Draft -> Open, Open -> Closed)
   * @param {string|number} termId
   * @param {Object} data - { status }
   */
  changeStatus(termId, data) {
    return httpPatch(`/terms/${termId}/status`, data);
  },

  /**
   * Delete a term if it has no related data
   * @param {string|number} termId
   */
  delete(termId) {
    return httpDelete(`/terms/${termId}`);
  },
};

