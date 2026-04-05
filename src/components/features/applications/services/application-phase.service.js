import { httpGet } from '@/services/http-client.service';

const BASE_URL = '/internship-phases';

/**
 * Phases API for the Applications feature (HR).
 * Uses `silent: true` to avoid global /unauthorized redirect when this optional filter endpoint is RBAC-restricted.
 */
export const applicationPhaseService = {
  getPhases(params = {}) {
    // Prefer the general listing endpoint; `/internship-phases/me` is RBAC-restricted for some roles (e.g. HR).
    // Still keep `silent: true` because phases are only an optional filter source for Applications.
    return httpGet(
      BASE_URL,
      {
        PageNumber: params.PageNumber || params.page || 1,
        PageSize: params.PageSize || 50,
        ...params,
      },
      { silent: true }
    );
  },

  // Backwards-compatible alias used by the Applications UI.
  getMyPhases(params = {}) {
    return this.getPhases(params);
  },
};
