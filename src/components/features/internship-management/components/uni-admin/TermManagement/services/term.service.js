import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from '@/services/httpClient';

export const TermService = {
  getAll(params = {}) {
    return httpGet('/terms', params);
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

  delete(id, reason) {
    const url = reason ? `/terms/${id}?reason=${encodeURIComponent(reason)}` : `/terms/${id}`;
    return httpDelete(url);
  },

  updateStatus(id, data) {
    return httpPatch(`/terms/${id}/status`, data);
  },
};
