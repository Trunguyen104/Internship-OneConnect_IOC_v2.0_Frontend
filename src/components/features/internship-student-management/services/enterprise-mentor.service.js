import { httpGet } from '@/services/httpClient';

const BASE_URL = '/enterprises/me/mentors';
const MENTOR_ROLE = 6;

export const EnterpriseMentorService = {
  async getMentors(params = {}) {
    return httpGet(BASE_URL, { ...params, Role: MENTOR_ROLE });
  },
};
