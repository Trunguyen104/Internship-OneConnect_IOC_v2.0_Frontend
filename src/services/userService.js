import { httpGet } from './httpClient';

export const userService = {
  getMe() {
    return httpGet('/Auth/me');
  },
};
