import { httpGet, httpPost, httpPut, httpDelete } from '@/services/httpClient';

export const enterpriseService = {
  getAll(params = { PageNumber: 1, PageSize: 100 }) {
    return httpGet('/enterprises', params);
  },
  getById(id) {
    return httpGet(`/enterprises/${id}`);
  },
  create(payload) {
    return httpPost('/enterprises', payload);
  },
  update(id, payload) {
    return httpPut(`/enterprises/${id}`, payload);
  },
  delete(id) {
    return httpDelete(`/enterprises/${id}`);
  },
};
