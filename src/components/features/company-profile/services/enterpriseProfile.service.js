'use client';

import { httpGet, httpPut } from '@/services/httpClient';

export function getMyEnterpriseProfile() {
  return httpGet('/enterprises/mine');
}

export function updateEnterpriseProfile(enterpriseId, payload) {
  return httpPut(`/enterprises/${enterpriseId}`, payload);
}

// Backward-compatible alias (avoid breaking any existing imports)
export const enterpriseProfileService = {
  getProfile: getMyEnterpriseProfile,
  updateProfile: updateEnterpriseProfile,
};
