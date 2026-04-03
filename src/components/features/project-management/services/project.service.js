import httpClient from '@/services/http-client.service';

const BASE_URL = '/projects';

export const ProjectService = {
  async getAll(params) {
    // If internshipId is provided, fetch specifically for that group
    if (params.internshipId) {
      return httpClient.httpGet(`${BASE_URL}/internship-group`, params);
    }
    // Otherwise fetch all projects for the mentor/enterprise
    return httpClient.httpGet(BASE_URL, params);
  },

  async getById(id) {
    return httpClient.httpGet(`${BASE_URL}/${id}`);
  },

  async create(payload) {
    // Payload expected: { internshipId, projectName, projectCode, description, startDate, endDate, field, requirements, deliverables, template }
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

  async unpublish(id) {
    return httpClient.httpPatch(`${BASE_URL}/${id}/unpublish`);
  },

  async complete(id) {
    return httpClient.httpPatch(`${BASE_URL}/${id}/complete`);
  },

  async archive(id) {
    return httpClient.httpPost(`${BASE_URL}/${id}/archive`);
  },

  async getAssignedStudents(projectId) {
    return httpClient.httpGet(`${BASE_URL}/${projectId}/students`);
  },

  async getGroupsForMentor() {
    return httpClient.httpGet('/internship-groups', { pageSize: 100, IncludeArchived: true });
  },

  async getStudentsByGroup(groupId) {
    // Backend returns students within the Group Detail DTO as 'members'
    return httpClient.httpGet(`/internship-groups/${groupId}`);
  },

  async assignGroup(projectId, internshipId) {
    return httpClient.httpPost(`${BASE_URL}/${projectId}/assign-group`, { internshipId });
  },

  async changeGroup(projectId, newInternshipId) {
    return httpClient.httpPatch(`${BASE_URL}/${projectId}/change-group`, { newInternshipId });
  },
};
