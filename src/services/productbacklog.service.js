// src/services/productbacklog.service.js
// LỖI QUAN TRỌNG: Bạn cần thêm httpPatch vào danh sách import
import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from './httpClient'; 

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
  getWorkItemById(projectId, workItemId) {
    return httpGet(`/projects/${projectId}/work-items/${workItemId}`);
  },
  createWorkItem(projectId, payload) {
    return httpPost(`/projects/${projectId}/work-items`, payload);
  },
  updateWorkItem(projectId, workItemId, payload) {
    return httpPut(`/projects/${projectId}/work-items/${workItemId}`, payload);
  },

  // FIX: API PATCH để chuyển vào Sprint theo đúng ảnh Swagger của bạn
  moveWorkItemToSprint(projectId, workItemId, sprintId) {
    return httpPatch(`/projects/${projectId}/work-items/${workItemId}/sprint`, { sprintId });
  },

  // FIX: API PATCH để đưa ngược về Backlog theo đúng ảnh Swagger
  moveWorkItemToBacklog(projectId, workItemId) {
    return httpPatch(`/projects/${projectId}/work-items/${workItemId}/backlog`, {});
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

  // Start/Complete Sprint
  startSprint(projectId, sprintId, payload) {
    return httpPost(`/projects/${projectId}/sprints/${sprintId}/start`, payload);
  },

  completeSprint(projectId, sprintId, payload) {
    return httpPost(`/projects/${projectId}/sprints/${sprintId}/complete`, payload);
  },
};