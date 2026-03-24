import { httpGet } from '@/services/httpClient';

const BASE_URL = '/enterprises/me/terms/active';

export const EnterpriseTermService = {
  async getActiveTerms(params = {}) {
    return httpGet(BASE_URL, params);
  },
  async getAllTerms() {
    return httpGet('/terms');
  },
  async getUpcomingTerms() {
    return httpGet('/enterprises/me/terms', { status: 1 });
  },
};
