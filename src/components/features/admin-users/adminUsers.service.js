import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from '@/services/httpClient';

export const adminUsersService = {
  getList(params = {}) {
    return httpGet('/admin-users', params);
  },

  getById(id) {
    return httpGet(`/admin-users/${id}`);
  },

  create(payload) {
    return httpPost('/admin-users', payload);
  },

  update(id, payload) {
    return httpPut(`/admin-users/${id}`, payload);
  },

  delete(id) {
    return httpDelete(`/admin-users/${id}`);
  },

  toggleStatus(id, newStatus) {
    // Backend expects enum value in body (serialized as integer by default).
    return httpPatch(`/admin-users/${id}/status`, newStatus);
  },

  resetPassword(id, reason) {
    // Backend controller expects raw string in body.
    return httpPost(`/admin-users/${id}/reset-password`, reason);
  },
};
