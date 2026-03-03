import { httpGet, httpPost, httpDelete, httpPatch } from './httpClient';

const StakeholderIssueService = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/stakeholder-issues${query ? `?${query}` : ''}`);
  },

  create: (data) => {
    return httpPost('/stakeholder-issues', data);
  },

  getById: (id) => {
    return httpGet(`/stakeholder-issues/${id}`);
  },

  delete: (id) => {
    return httpDelete(`/stakeholder-issues/${id}`);
  },

  updateStatus: (id, status) => {
    return httpPatch(`/stakeholder-issues/${id}/status`, { status });
  },
};

export default StakeholderIssueService;
