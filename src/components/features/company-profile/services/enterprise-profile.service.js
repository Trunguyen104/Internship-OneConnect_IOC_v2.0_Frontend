'use client';

import { httpGet, httpPut } from '@/services/http-client.service';

export function getEnterpriseById(enterpriseId) {
  return httpGet(`/enterprises/${enterpriseId}`);
}

export function updateEnterpriseProfile(enterpriseId, payload) {
  return httpPut(`/enterprises/${enterpriseId}`, payload);
}

// Backward-compatible alias (avoid breaking any existing imports)
export const enterpriseProfileService = {
  getProfileById: getEnterpriseById,
  updateProfile: updateEnterpriseProfile,
};
