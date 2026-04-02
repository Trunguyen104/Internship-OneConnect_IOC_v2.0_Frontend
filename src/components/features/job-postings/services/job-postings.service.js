import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/http-client.service';

export const JobPostingsService = {
  /**
   * Get list of jobs for HR
   */
  getList(params = {}) {
    return httpGet('/jobs', params);
  },

  /**
   * Get detail of a job posting
   */
  getById(id) {
    return httpGet(`/jobs/${id}`);
  },

  /**
   * Create new job posting (publish)
   */
  create(data) {
    return httpPost('/jobs', data);
  },

  /**
   * Create or update job posting as draft
   */
  saveDraft(data) {
    return httpPost('/jobs/draft', data);
  },

  /**
   * Update existing job posting
   */
  update(id, data) {
    return httpPut(`/jobs/${id}`, data);
  },

  /**
   * Delete job posting (soft delete)
   */
  delete(id, data = { confirmWhenHasActiveApplications: true }) {
    return httpDelete(`/jobs/${id}`, data);
  },

  /**
   * Publish a draft job posting
   */
  publish(id) {
    return httpPost(`/jobs/${id}/publish`, {});
  },

  /**
   * Close a job posting
   */
  close(id, data = { confirmWhenHasActiveApplications: false }) {
    return httpPatch(`/jobs/${id}/close`, data);
  },

  /**
   * Get internship phases for selection
   */
  getMyPhases() {
    return httpGet('/internship-phases');
  },
};
