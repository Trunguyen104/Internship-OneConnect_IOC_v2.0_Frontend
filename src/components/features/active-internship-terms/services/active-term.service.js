import { httpGet } from '@/services/http-client.service';

export const activeTermService = {
  getActiveTerms() {
    return httpGet('/enterprises/me/terms/active');
  },
};
