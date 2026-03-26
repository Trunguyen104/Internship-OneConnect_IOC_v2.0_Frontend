import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/httpClient';

export const TermService = {
  getAll(params = {}, options = {}) {
    return httpGet('/terms', params, options);
  },

  getById(id) {
    return httpGet(`/terms/${id}`);
  },

  create(data) {
    return httpPost('/terms', data);
  },

  update(id, data) {
    return httpPut(`/terms/${id}`, data);
  },

  delete(id) {
    return httpDelete(`/terms/${id}`);
  },

  closeTerm(id, data) {
    return httpPatch(`/terms/${id}/close`, data);
  },
};
