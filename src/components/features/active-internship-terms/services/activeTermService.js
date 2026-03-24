import { httpGet } from '@/services/httpClient';

export const activeTermService = {
  getActiveTerms() {
    return httpGet('/enterprises/me/terms/active');
  },
};
