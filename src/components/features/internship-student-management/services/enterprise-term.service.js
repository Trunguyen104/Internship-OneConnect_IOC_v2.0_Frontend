import { httpGet } from '@/services/httpClient';

const BASE_URL = '/enterprises/me/active-terms';

export const EnterpriseTermService = {
  async getActiveTerms(universityId) {
    const params = universityId ? { universityId } : {};
    return httpGet(BASE_URL, params);
  },
};
