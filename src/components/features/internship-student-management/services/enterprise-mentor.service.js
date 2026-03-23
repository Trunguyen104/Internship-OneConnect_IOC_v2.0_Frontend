import { httpGet } from '@/services/httpClient';

const BASE_URL = '/enterprises/me/mentors';

export const EnterpriseMentorService = {
  async getMentors(params = {}) {
    return httpGet(BASE_URL, params);
  },
};
