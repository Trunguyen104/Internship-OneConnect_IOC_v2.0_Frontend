import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';
export const LogBookService = {
  getAll(internshipId, params = {}) {
    const query = new URLSearchParams({
      InternshipId: internshipId,
      ...params,
    }).toString();

    return httpGet(`/logbook?${query}`);
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
