import { httpGet } from '@/services/http-client.service';

export const mineService = {
  getMyContext() {
    return httpGet('/mine/context');
  },
  getMyTerms() {
    return httpGet('/mine/internship-terms');
  },
};
