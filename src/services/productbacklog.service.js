// src/services/productbacklog.service.js
import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';

export const productBacklogService = {
  // Epics
  getEpics(projectId) {
    return httpGet(`/projects/${projectId}/epics`);
  },
  createEpic(projectId, payload) {
    return httpPost(`/projects/${projectId}/epics`, payload);
  },
  getEpicById(projectId, id) {
    return httpGet(`/projects/${projectId}/epics/${id}`);
  },
  updateEpic(projectId, id, payload) {
    return httpPut(`/projects/${projectId}/epics/${id}`, payload);
  },
  deleteEpic(projectId, id) {
    return httpDelete(`/projects/${projectId}/epics/${id}`);
  },

  // WorkItems (Backlog)
  getWorkItemsBacklog(projectId) {
    return httpGet(`/projects/${projectId}/work-items/backlog`);
  },
  createWorkItem(projectId, payload) {
    return httpPost(`/projects/${projectId}/work-items`, payload);
  },
};
