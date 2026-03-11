import httpClient from '@/services/httpClient';

export const getProjectResources = (projectId) =>
  httpClient.httpGet(`/projectresources?ProjectId=${projectId}`);

export const getProjectResourceById = (resourceId) =>
  httpClient.httpGet(`/projectresources/${resourceId}`);

export const createProjectResource = (formData) =>
  httpClient.httpPost(`/projectresources`, formData);

export const updateProjectResource = (resourceId, payload) =>
  httpClient.httpPut(`/projectresources/${resourceId}`, payload);

export const deleteProjectResource = (id) => httpClient.httpDelete(`/projectresources/${id}`);

