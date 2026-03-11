// src/services/productbacklog.service.js
// LỖI QUAN TRỌNG: Bạn cần thêm httpPatch vào danh sách import
import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from './httpClient';

export const productBacklogService = {
  // Epics
  getEpics(projectId) {
    return httpGet(`/epics?projectId=${projectId}`);
  },
  createEpic(projectId, payload) {
    return httpPost(`/epics`, payload);
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
    return httpGet(`/work-items/backlog?projectId=${projectId}`);
  },
  getWorkItemById(projectId, workItemId) {
    return httpGet(`/work-items/${workItemId}?projectId=${projectId}`);
  },
  createWorkItem(projectId, payload) {
    return httpPost(`/work-items?projectId=${projectId}`, payload);
  },
  updateWorkItem(projectId, workItemId, payload) {
    return httpPut(`/work-items/${workItemId}?projectId=${projectId}`, payload);
  },

  // FIX: API PATCH để chuyển vào Sprint theo đúng ảnh Swagger của bạn
  moveWorkItemToSprint(projectId, workItemId, sprintId) {
    return httpPatch(`/work-items/${workItemId}/sprint?projectId=${projectId}`, { 
      projectId,
      workItemId,
      targetSprintId: sprintId 
    });
  },

  // FIX: API PATCH để đưa ngược về Backlog theo đúng ảnh Swagger
  moveWorkItemToBacklog(projectId, workItemId) {
    return httpPatch(`/work-items/${workItemId}/backlog?projectId=${projectId}`, {
      projectId,
      workItemId
    });
  },

  // Sprints
  getSprints(projectId) {
    return httpGet(`/sprints?projectId=${projectId}`);
  },
  createSprint(projectId, payload) {
    return httpPost(`/sprints?projectId=${projectId}`, payload);
  },
  getSprintById(projectId, sprintId) {
    return httpGet(`/sprints/${sprintId}?projectId=${projectId}`);
  },
  updateSprint(projectId, sprintId, payload) {
    return httpPut(`/sprints/${sprintId}?projectId=${projectId}`, payload);
  },
  deleteSprint(projectId, sprintId) {
    return httpDelete(`/sprints/${sprintId}?projectId=${projectId}`);
  },

  // Start/Complete Sprint
  startSprint(projectId, sprintId, payload) {
    return httpPost(`/sprints/${sprintId}/start?projectId=${projectId}`, payload);
  },

  completeSprint(projectId, sprintId, payload) {
    return httpPost(`/sprints/${sprintId}/complete?projectId=${projectId}`, payload);
  },
};
