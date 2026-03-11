import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';
export const LogBookService = {
  getAll(internshipId, params = {}) {
    const query = new URLSearchParams({
      InternshipId: internshipId,
      ...params,
    }).toString();

    return httpGet(`/logbooks?${query}`);
  },

  getById: (id) => {
    return httpGet(`/logbooks/${id}`);
  },

  create: (payload) => {
    return httpPost('/logbooks', payload);
  },

  update: (id, payload) => {
    return httpPut(`/logbooks/${id}`, payload);
  },

  delete: (id) => {
    return httpDelete(`/logbooks/${id}`);
  },
};
