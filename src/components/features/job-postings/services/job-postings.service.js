import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/http-client.service';

export const JobPostingsService = {
  /**
   * Retrieves a paginated list of job postings for the current enterprise.
   *
   * @param {Object} params - Filtering and pagination parameters.
   * @returns {Promise} API response object.
   */
  getList(params = {}) {
    return httpGet('/jobs', params);
  },

  /**
   * Retrieves full details for a specific job posting by its ID.
   *
   * @param {string|number} id - The unique identifier of the job posting.
   * @returns {Promise} API response object.
   */
  getById(id) {
    return httpGet(`/jobs/${id}`);
  },

  /**
   * Creates and immediately publishes a new job posting.
   *
   * @param {Object} data - The job posting payload.
   * @returns {Promise} API response object.
   */
  create(data) {
    return httpPost('/jobs', data);
  },

  /**
   * Saves or updates a job posting in DRAFT status.
   *
   * @param {Object} data - The job posting payload.
   * @returns {Promise} API response object.
   */
  saveDraft(data) {
    return httpPost('/jobs/draft', data);
  },

  /**
   * Updates an existing job posting's information.
   *
   * @param {string|number} id - The job posting ID.
   * @param {Object} data - The updated payload.
   * @returns {Promise} API response object.
   */
  update(id, data) {
    return httpPut(`/jobs/${id}`, data);
  },

  /**
   * Performs a soft deletion of a job posting.
   *
   * @param {string|number} id - The job posting ID.
   * @param {Object} data - Confirmation flags for active applications.
   * @returns {Promise} API response object.
   */
  delete(id, data = { confirmWhenHasActiveApplications: true }) {
    return httpDelete(`/jobs/${id}`, data);
  },

  /**
   * Transitions a DRAFT job posting to PUBLISHED status.
   *
   * @param {string|number} id - The job posting ID.
   * @returns {Promise} API response object.
   */
  publish(id) {
    return httpPost(`/jobs/${id}/publish`, {});
  },

  /**
   * Closes a PUBLISHED job posting to prevent new applications.
   *
   * @param {string|number} id - The job posting ID.
   * @param {Object} data - Confirmation flags for active applications.
   * @returns {Promise} API response object.
   */
  close(id, data = { confirmWhenHasActiveApplications: false }) {
    return httpPatch(`/jobs/${id}/close`, data);
  },

  /**
   * Fetches internship phases associated with the recruiter's enterprise.
   *
   * @param {Object} params - Query parameters.
   * @returns {Promise} API response object.
   */
  getMyPhases(params = {}) {
    return httpGet('/internship-phases', params);
  },
};
