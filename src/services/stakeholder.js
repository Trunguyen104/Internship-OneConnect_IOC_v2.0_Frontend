import httpClient from './httpClient';

export const StakeholderService = {
  getByProject(projectId, params) {
    const query = params ? new URLSearchParams(params).toString() : '';
    return httpClient.httpGet(`/projects/${projectId}/stakeholders${query ? `?${query}` : ''}`);
  },

  getById(id) {
    return httpClient.httpGet(`/Stakeholders/${id}`);
  },

  create(data) {
    return httpClient.httpPost('/Stakeholders', data);
  },

  update(id, data) {
    return httpClient.httpPut(`/Stakeholders/${id}`, data);
  },

  remove(id) {
    return httpClient.httpDelete(`/Stakeholders/${id}`);
  },
};
