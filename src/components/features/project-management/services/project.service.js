import httpClient from '@/services/httpClient';

const BASE_URL = '/projects';

export const ProjectService = {
  async getAll(params) {
    const queryParams = {
      PageNumber: params?.PageNumber || 1,
      PageSize: params?.PageSize || 10,
      SearchTerm: params?.SearchTerm || undefined,
      GroupId: params?.GroupId || undefined,
      Status: params?.Status || undefined,
      OrderByCreatedAscending: params?.OrderByCreatedAscending || false,
    };
    return httpClient.httpGet(BASE_URL, queryParams);
  },

  async getById(id) {
    return httpClient.httpGet(`${BASE_URL}/${id}`);
  },

  async create(payload) {
    return httpClient.httpPost(BASE_URL, payload);
  },

  async update(id, payload) {
    return httpClient.httpPut(`${BASE_URL}/${id}`, payload);
  },

  async delete(id) {
    return httpClient.httpDelete(`${BASE_URL}/${id}`);
  },

  async publish(id) {
    return httpClient.httpPatch(`${BASE_URL}/${id}/publish`);
  },

  async complete(id) {
    return httpClient.httpPatch(`${BASE_URL}/${id}/complete`);
  },

  async assignStudents(projectId, studentIds) {
    return httpClient.httpPost(`${BASE_URL}/${projectId}/assign`, { studentIds });
  },

  async unassignStudent(projectId, studentId) {
    return httpClient.httpDelete(`${BASE_URL}/${projectId}/students/${studentId}`);
  },

  async getAssignedStudents(projectId) {
    return httpClient.httpGet(`${BASE_URL}/${projectId}/students`);
  },

  async getGroupsForMentor() {
    return httpClient.httpGet('/internship-groups', { pageSize: 100 });
  },

  async getStudentsByGroup(groupId) {
    return httpClient.httpGet(`/internship-groups/${groupId}/students`);
  },
};
