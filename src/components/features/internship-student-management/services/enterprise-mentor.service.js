import { httpGet } from '@/services/http-client.service';

const BASE_URL = '/user-management';

export const EnterpriseMentorService = {
  async getMentors(params = {}) {
    // Reverting to /user-management to avoid 404, but fetching all to find mentors locally
    return httpGet(BASE_URL, {
      PageNumber: 1,
      PageSize: 100,
      ...params,
    });
  },
};
