import { httpGet, httpPost, httpPut, httpDelete } from '@/services/httpClient';

export const InternshipGroupService = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/internshipgroups${query ? `?${query}` : ''}`);
  },

  // getMine has been removed as per backend refactor.
  // Students should use getAll() which is filtered by the backend or pass specific filters.

  getTermById(id) {
    return httpGet(`/terms/${id}`);
  },

  getById(id) {
    return httpGet(`/internshipgroups/${id}`);
  },

  create(data) {
    return httpPost('/internshipgroups', data);
  },

  update(id, data) {
    return httpPut(`/internshipgroups/${id}`, data);
  },

  delete(id) {
    return httpDelete(`/internshipgroups/${id}`);
  },

  addStudents(data) {
    return httpPost('/internshipgroups/students', data);
  },

  removeStudents(data) {
    return httpDelete('/internshipgroups/students', {
      body: JSON.stringify(data),
    });
  },
};
