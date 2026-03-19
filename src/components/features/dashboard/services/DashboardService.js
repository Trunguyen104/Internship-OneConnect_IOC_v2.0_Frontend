import httpClient from '@/services/httpClient';
import { TermService } from '../../TermManagement/services/term.service';
import { userService } from '@/components/features/user/services/userService';

export const DashboardService = {
  async getProfile() {
    return userService.getMe();
  },

  async getStats() {
    const stats = {
      totalStudents: 0,
      activeTerms: 0,
      totalGroups: 0,
    };

    // 1. Fetch Terms for active counts
    try {
      const termsRes = await TermService.getAll({ pageSize: 100 });
      if (termsRes?.data) {
        const items = termsRes.data.items || [];
        stats.activeTerms = items.filter((t) => t.status === 2 || t.status === 'Active').length;
      }
    } catch (e) {
      console.warn('Dashboard stats: terms fetch failed', e);
    }

    // 2. Fetch Enrollment count
    try {
      const enrollRes = await httpClient.httpGet('/enrollments', { pageSize: 1 });
      if (enrollRes?.data) {
        stats.totalStudents = enrollRes.data.totalCount || 0;
      }
    } catch (e) {
      console.warn('Dashboard stats: enrollment fetch failed', e);
    }

    // 3. Fetch Internship Groups count
    try {
      const groupsRes = await httpClient.httpGet('/internship-groups', { pageSize: 1 });
      if (groupsRes?.data) {
        stats.totalGroups = groupsRes.data.totalCount || 0;
      }
    } catch (e) {
      console.warn('Dashboard stats: groups fetch failed', e);
    }

    return stats;
  },

  async getRecentTerms(limit = 5) {
    try {
      const res = await TermService.getAll({ pageSize: limit });
      return res?.data?.items || [];
    } catch (e) {
      console.warn('Dashboard: recent terms fetch failed', e);
      return [];
    }
  },
};
