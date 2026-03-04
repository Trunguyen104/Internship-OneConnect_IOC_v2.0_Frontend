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

  // WorkItems
  getWorkItemsBacklog(projectId) {
    return httpGet(`/projects/${projectId}/work-items/backlog`);
  },
  createWorkItem(projectId, payload) {
    return httpPost(`/projects/${projectId}/work-items`, payload);
  },
  updateWorkItem(projectId, workItemId, payload) {
    return httpPut(`/projects/${projectId}/work-items/${workItemId}`, payload);
  },

  // Sprints
  getSprints(projectId) {
    return httpGet(`/projects/${projectId}/sprints`);
  },
  createSprint(projectId, payload) {
    return httpPost(`/projects/${projectId}/sprints`, payload);
  },
  getSprintById(projectId, sprintId) {
    return httpGet(`/projects/${projectId}/sprints/${sprintId}`);
  },
  updateSprint(projectId, sprintId, payload) {
    return httpPut(`/projects/${projectId}/sprints/${sprintId}`, payload);
  },
  deleteSprint(projectId, sprintId) {
    return httpDelete(`/projects/${projectId}/sprints/${sprintId}`);
  },
  startSprint(projectId, sprintId) {
    return httpPost(`/projects/${projectId}/sprints/${sprintId}/start`);
  },
  completeSprint(projectId, sprintId) {
    return httpPost(`/projects/${projectId}/sprints/${sprintId}/complete`);
  },
};
