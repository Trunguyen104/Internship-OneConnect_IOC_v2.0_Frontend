import { httpGet } from '@/services/httpClient';

const BASE_URL = '/user-management';
const MENTOR_ROLE = 6;

export const EnterpriseMentorService = {
  async getMentors(params = {}) {
    // Aligned with user-management API
    return httpGet(BASE_URL, {
      Role: MENTOR_ROLE, // Default to 6
      PageNumber: 1,
      PageSize: 100,
      ...params,
    });
  },
};
