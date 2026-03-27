import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http-client.service';
export const LogBookService = {
  getAll(internshipId, params = {}) {
    return httpGet('/logbook', {
      InternshipId: internshipId,
      ...params,
    });
  },

  getById: (id) => {
    return httpGet(`/logbook/${id}`);
  },

  create: (payload) => {
    return httpPost('/logbook', payload);
  },

  update: (id, payload) => {
    return httpPut(`/logbook/${id}`, payload);
  },

  delete: (id) => {
    return httpDelete(`/logbook/${id}`);
  },
};
