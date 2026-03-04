import { httpGet } from './httpClient';

export const ProjectService = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/projects${query ? `?${query}` : ''}`);
  },

  getMy() {
    return httpGet('/projects/my');
  },

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

  getByInternshipGroup(internshipId) {
    return httpGet(`/projects/internship-group/${internshipId}`);
  },
};
