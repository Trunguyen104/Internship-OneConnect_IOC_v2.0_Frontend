import httpClient from './httpClient';

export const getProjectResources = (projectId) =>
  httpClient.httpGet(`/project-resources?ProjectId=${projectId}`);

export const getProjectResourceById = (resourceId) =>
  httpClient.httpGet(`/project-resources/${resourceId}`);

export const createProjectResource = (formData) =>
  httpClient.httpPost(`/project-resources`, formData);

export const updateProjectResource = (resourceId, payload) =>
  httpClient.httpPut(`/project-resources/${resourceId}`, payload);

export const deleteProjectResource = (id) => httpClient.httpDelete(`/project-resources/${id}`);
