import { httpGet } from '@/services/httpClient';

const BASE_URL = '/user-management';
const MENTOR_ROLE = 6;

export const EnterpriseMentorService = {
  async getMentors(params = {}) {
    // Aligned with user-management API
    return httpGet(BASE_URL, {
      ...params,
      Role: MENTOR_ROLE,
      PageNumber: params.PageNumber || 1,
      PageSize: params.PageSize || 100,
    });
  },
};
