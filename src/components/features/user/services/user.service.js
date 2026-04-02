import { httpGet, httpPut } from '@/services/http-client.service';

export const userService = {
  getMe() {
    return httpGet('/auth/me');
  },
  updateMe(data) {
    // If data is FormData, send it as is. httpClient handles headers.
    return httpPut('/auth/me', data);
  },
  downloadCV() {
    return httpGet('/auth/me/cv', {}, { responseType: 'blob' });
  },
};
