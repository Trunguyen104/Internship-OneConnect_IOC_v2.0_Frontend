import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http-client.service';

export const universityService = {
  getAll(params = { PageNumber: 1, PageSize: 100 }) {
    return httpGet('/universities', params);
  },
  getById(id) {
    return httpGet(`/universities/${id}`);
  },
  create(payload) {
    return httpPost('/universities', payload);
  },
  update(id, payload) {
    return httpPut(`/universities/${id}`, payload);
  },
  delete(id) {
    return httpDelete(`/universities/${id}`);
  },
};
