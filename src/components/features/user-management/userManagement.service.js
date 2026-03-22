import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/httpClient';

export const userManagementService = {
  getList(params = {}) {
    return httpGet('/user-management', params);
  },

  getById(id) {
    return httpGet(`/user-management/${id}`);
  },

  create(payload) {
    return httpPost('/user-management', payload);
  },

  update(id, payload) {
    return httpPut(`/user-management/${id}`, payload);
  },

  delete(id) {
    return httpDelete(`/user-management/${id}`);
  },

  toggleStatus(id, newStatus) {
    return httpPatch(`/user-management/${id}/status`, newStatus);
  },

  resetPassword(id, reason) {
    return httpPost(`/user-management/${id}/reset-password`, reason);
  },
};
