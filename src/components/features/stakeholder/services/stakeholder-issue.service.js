import { httpDelete, httpGet, httpPatch, httpPost } from '@/services/http-client.service';

const StakeholderIssueService = {
  getAll: (params) => {
    return httpGet('/stakeholder-issues', params);
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
    return httpPatch(`/stakeholder-issues/${id}/status`, {
      status: Number(status),
    });
  },
};

export default StakeholderIssueService;
