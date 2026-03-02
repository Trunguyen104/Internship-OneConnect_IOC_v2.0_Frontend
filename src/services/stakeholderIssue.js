import { httpGet, httpPost, httpDelete, httpPatch } from './httpClient';

const StakeholderIssueService = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/StakeholderIssues${query ? `?${query}` : ''}`);
  },

  create: (data) => {
    return httpPost('/StakeholderIssues', data);
  },

  delete: (id) => {
    return httpDelete(`/StakeholderIssues/${id}`);
  },

  updateStatus: (id, status) => {
    return httpPatch(`/StakeholderIssues/${id}/status`, { status });
  },

  getById: (id) => {
    return httpGet(`/StakeholderIssues/${id}`);
  },
};

export default StakeholderIssueService;
