import { httpGet, httpPost, httpPut, httpDelete } from '@/services/httpClient';

export const ProjectService = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/projects${query ? `?${query}` : ''}`);
  },

  // getMy removed to standardize on paginated list endpoints.

  getById(projectId) {
    return httpGet(`/projects/${projectId}`);
  },

  create(data) {
    return httpPost('/projects', data);
  },

  update(projectId, data) {
    return httpPut(`/projects/${projectId}`, data);
  },

  delete(projectId) {
    return httpDelete(`/projects/${projectId}`);
  },

  // getByInternshipGroup(internshipId) {
  //   return httpGet(`/projects/internship-group/${internshipId}`);
  // },
  getByInternshipGroup(internshipId) {
    return this.getAll({ InternshipId: internshipId, PageSize: 1 });
  },
};
