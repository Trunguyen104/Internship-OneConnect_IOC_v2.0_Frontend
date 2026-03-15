import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/httpClient';

// Backlog API service wrapper (epics, work items, sprints)
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

  // Work items
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

  // PATCH endpoint: move a work item into a sprint
  moveWorkItemToSprint(projectId, workItemId, sprintId) {
    return httpPatch(`/workitems/${workItemId}/sprint`, {
      projectId,
      workItemId,
      targetSprintId: sprintId,
    });
  },

  // PATCH endpoint: move a work item back to the backlog
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

  // Start/complete sprint
  startSprint(projectId, sprintId, payload) {
    return httpPost(`/sprints/${sprintId}/start?projectId=${projectId}`, payload);
  },
  completeSprint(projectId, sprintId, payload) {
    return httpPost(`/sprints/${sprintId}/complete?projectId=${projectId}`, payload);
  },
};
