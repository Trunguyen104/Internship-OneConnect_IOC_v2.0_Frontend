import { httpDelete, httpGet, httpPost } from '@/services/http-client.service';

/**
 * Public Holiday Service — logic for fetching and managing national holidays.
 */
export const PublicHolidayService = {
  /**
   * Get all public holidays for a specific year.
   * @param {number} year - The year to query (e.g. 2026).
   */
  getAll(year) {
    return httpGet('/public-holidays', { year }, { silent: true });
  },

  /**
   * Manually create a single public holiday entry.
   * @param {Object} data - { date, description }
   */
  create(data) {
    return httpPost('/public-holidays', data);
  },

  /**
   * Delete a public holiday entry by ID.
   * @param {string} id - UUID
   */
  delete(id) {
    return httpDelete(`/public-holidays/${id}`);
  },

  /**
   * Sync public holidays from external API for a specific year.
   * @param {Object} data - { year, countryCode }
   */
  sync(data) {
    return httpPost('/public-holidays/sync', data);
  },
};
