import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';

export const LogBookService = {
  getAll(projectId, params = {}) {
    // Filter out undefined or null parameters
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const query = new URLSearchParams(cleanParams).toString();
    return httpGet(`/projects/${projectId}/logbooks${query ? `?${query}` : ''}`);
  },

  getById(projectId, logbookId) {
    return httpGet(`/projects/${projectId}/logbooks/${logbookId}`);
  },

  create(projectId, data) {
    return httpPost(`/projects/${projectId}/logbooks`, data);
  },

  update(projectId, logbookId, data) {
    return httpPut(`/projects/${projectId}/logbooks/${logbookId}`, data);
  },

  delete(projectId, logbookId) {
    return httpDelete(`/projects/${projectId}/logbooks/${logbookId}`);
  },
};
