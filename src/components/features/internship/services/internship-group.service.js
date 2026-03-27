import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http-client.service';

export const InternshipGroupService = {
  getAll(params = {}, options = {}) {
    return httpGet('/internship-groups', params, options);
  },

  getMine(params = {}, options = {}) {
    return httpGet('/internship-groups/mine', params, options);
  },

  getMyPhases(params = {}, options = {}) {
    return httpGet('/internship-groups/mine/internship-phases', params, options);
  },

  getMyTerms(params = {}, options = {}) {
    return httpGet('/internship-groups/mine/internship-terms', params, options);
  },

  getById(id, params = {}) {
    return httpGet(`/internship-groups/${id}`, params);
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
