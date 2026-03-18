import { httpGet } from '@/services/httpClient';

export const userService = {
  getMe() {
    return httpGet('/auth/me');
  },
};
