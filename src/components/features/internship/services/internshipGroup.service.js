import { httpGet, httpPost, httpPut, httpDelete } from '@/services/httpClient';

export const InternshipGroupService = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/internshipgroups${query ? `?${query}` : ''}`);
  },

  getMine(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/mine${query ? `?${query}` : ''}`);
  },

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
    return httpDelete('/internshipgroups/students', data);
  },
};
