import { httpDelete, httpGet, httpPost, httpPut } from '@/services/httpClient';

export const InternshipGroupService = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/internship-groups${query ? `?${query}` : ''}`);
  },

  getMine(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/mine${query ? `?${query}` : ''}`);
  },

  getMyTerms(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/mine/internship-terms${query ? `?${query}` : ''}`);
  },

  getAllTerms(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/terms${query ? `?${query}` : ''}`);
  },

  getTermById(id) {
    return httpGet(`/terms/${id}`);
  },

  getById(id) {
    return httpGet(`/internship-groups/${id}`);
  },

  create(data) {
    return httpPost('/internship-groups', data);
  },

  update(id, data) {
    return httpPut(`/internship-groups/${id}`, data);
  },

  delete(id) {
    return httpDelete(`/internship-groups/${id}`);
  },

  addStudents(id, data) {
    return httpPost(`/internship-groups/${id}/students`, data);
  },

  removeStudents(id, data) {
    return httpDelete(`/internship-groups/${id}/students`, data);
  },
};
