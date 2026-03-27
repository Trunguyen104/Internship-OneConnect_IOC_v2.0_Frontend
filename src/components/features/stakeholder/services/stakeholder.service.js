import httpClient from '@/services/http-client.service';

export const StakeholderService = {
  getByProject(internshipId, params = {}) {
    return httpClient.httpGet('/stakeholders', {
      internshipId,
      ...params,
    });
  },
  getById(id) {
    return httpClient.httpGet(`/stakeholders/${id}`);
  },

  create(data) {
    return httpClient.httpPost('/stakeholders', data);
  },

  update(id, data) {
    return httpClient.httpPut(`/stakeholders/${id}`, data);
  },

  remove(stakeholderId, internshipId) {
    return httpClient.httpDelete(`/stakeholders/${stakeholderId}`, {
      stakeholderId,
      internshipId,
    });
  },
};
