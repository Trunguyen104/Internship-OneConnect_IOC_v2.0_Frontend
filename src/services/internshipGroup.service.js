import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';

export const InternshipGroupService = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/internshipgroups${query ? `?${query}` : ''}`);
  },

  getById(id) {
    return httpGet(`/internshipgroups/${id}`);
  },

  create(data) {
    return httpPost('/internshipgroups', data);
  },

  update(id, data) {
    return httpPut(`/internshipgroups/${id}`, data);
  },

  delete(id) {
    return httpDelete(`/internshipgroups/${id}`);
  },

  addStudents(id, data) {
    return httpPost(`/internshipgroups/${id}/students`, data);
  },

  removeStudents(id, data) {
    return httpDelete(`/internshipgroups/${id}/students`, {
      body: JSON.stringify(data),
    });
  },
};
