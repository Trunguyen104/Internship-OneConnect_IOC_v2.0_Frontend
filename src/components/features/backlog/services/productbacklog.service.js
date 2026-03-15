// src/services/productbacklog.service.js
// LỖI QUAN TRỌNG: Bạn cần thêm httpPatch vào danh sách import
import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from '@/services/httpClient';

export const productBacklogService = {
  // Epics
  getEpics(projectId) {
    return httpGet('/epics', { projectId });
  },
  createEpic(projectId, payload) {
    return httpPost('/epics', payload);
  },
  getEpicById(projectId, id) {
    return httpGet(`/epics/${id}`, { projectId });
  },
  updateEpic(projectId, id, payload) {
    return httpPut(`/epics/${id}`, { ...payload, projectId });
  },
  deleteEpic(projectId, id) {
    return httpDelete(`/epics/${id}`, { projectId });
  },

  // WorkItems
  getWorkItemsBacklog(projectId) {
    return httpGet('/workitems/backlog', { projectId });
  },
  getWorkItemById(projectId, workItemId) {
    return httpGet(`/workitems/${workItemId}`, { projectId });
  },
  createWorkItem(projectId, payload) {
    return httpPost(`/workitems?projectId=${projectId}`, payload);
  },
  updateWorkItem(projectId, workItemId, payload) {
    return httpPut(`/workitems/${workItemId}`, { ...payload, projectId });
  },
  deleteWorkItem(projectId, workItemId) {
    return httpDelete(`/workitems/${workItemId}`, { projectId });
  },

  // FIX: API PATCH để chuyển vào Sprint theo đúng ảnh Swagger của bạn
  moveWorkItemToSprint(projectId, workItemId, sprintId) {
    return httpPatch(`/workitems/${workItemId}/sprint`, {
      projectId,
      workItemId,
      targetSprintId: sprintId,
    });
  },

  // FIX: API PATCH để đưa ngược về Backlog theo đúng ảnh Swagger
  moveWorkItemToBacklog(projectId, workItemId) {
    return httpPatch(`/workitems/${workItemId}/backlog`, {
      projectId,
      workItemId,
    });
  },

  // Sprints
  getSprints(projectId) {
    return httpGet('/sprints', { projectId });
  },
  createSprint(projectId, payload) {
    // Standardize to use params object if proxy expects it,
    // but usually POST payload contains the data and projectId is in query.
    return httpPost(`/sprints?projectId=${projectId}`, payload);
  },
  getSprintById(projectId, sprintId) {
    return httpGet(`/sprints/${sprintId}`, { projectId });
  },
  updateSprint(projectId, sprintId, payload) {
    return httpPut(`/sprints/${sprintId}`, { ...payload, projectId });
  },
  deleteSprint(projectId, sprintId) {
    return httpDelete(`/sprints/${sprintId}`, { projectId });
  },

  // Start/Complete Sprint
  startSprint(projectId, sprintId, payload) {
    return httpPost(`/sprints/${sprintId}/start?projectId=${projectId}`, payload);
  },

  completeSprint(projectId, sprintId, payload) {
    return httpPost(`/sprints/${sprintId}/complete?projectId=${projectId}`, payload);
  },
};
