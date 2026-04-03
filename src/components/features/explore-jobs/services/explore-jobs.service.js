import { httpGet, httpPost } from '@/services/http-client.service';

export const ExploreJobsService = {
  /**
   * Get available jobs for students (Published, matching visibility)
   */
  getAvailableJobs(params = {}) {
    // Mapping frontend params to backend GetJobsQuery
    const apiParams = {
      SearchTerm: params.search || '',
      PageNumber: params.page || 1,
      PageSize: params.pageSize || 10,
      Status: params.status || 1, // Usually 1 is Published/Open
      IncludeDeleted: false,
      SortColumn: params.sortColumn || 'CreatedDate',
      SortOrder: params.sortOrder || 'Desc',
    };
    return httpGet('/jobs', apiParams);
  },

  /**
   * Get job posting details by id
   */
  getJobById(id) {
    return httpGet(`/jobs/${id}`);
  },

  /**
   * Apply for a job
   */
  applyJob(jobId, data = {}) {
    return httpPost(`/jobs/${jobId}/apply`, data);
  },

  /**
   * Check if student can apply for a specific job
   */
  checkEligibility(jobId) {
    // If backend has this endpoint, use it. Otherwise, this might need fallback
    return httpGet(`/jobs/${jobId}/eligibility`);
  },
};
