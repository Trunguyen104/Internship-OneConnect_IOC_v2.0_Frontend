import { httpGet } from '@/services/httpClient';

const BASE_URL = '/enterprises/me/terms/active';

export const EnterpriseTermService = {
  async getActiveTerms(universityId) {
    const params = universityId ? { universityId } : {};
    return httpGet(BASE_URL, params);
  },
  async getAllTerms() {
    return httpGet(BASE_URL);
  },
  async getUpcomingTerms() {
    return httpGet('/enterprises/me/terms', { status: 1 });
  },
};
