import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http-client.service';

export const ProjectService = {
  getAll(params = {}) {
    return httpGet('/projects', params);
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
