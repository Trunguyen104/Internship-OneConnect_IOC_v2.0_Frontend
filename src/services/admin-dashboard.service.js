import { httpGet } from '@/services/http-client.service';

/**
 * Service for fetching SuperAdmin Dashboard statistics.
 * Endpoint: GET /api/v1/admindashboard/stats
 */
export const adminDashboardService = {
  getStats() {
    return httpGet('/admindashboard/stats');
  },
};
