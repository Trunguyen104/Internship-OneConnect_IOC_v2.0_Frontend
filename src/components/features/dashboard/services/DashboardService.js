import { TermService } from '@/components/features/internship-term-management/services/term.service';
import { userService } from '@/components/features/user/services/userService';

export const DashboardService = {
  async getProfile() {
    return userService.getMe();
  },

  async getStats() {
    const stats = {
      totalStudents: 0,
      totalTerms: 0,
      totalGroups: 0,
      totalPlaced: 0,
      statusCounts: {
        upcoming: 0,
        active: 0,
        ended: 0,
        closed: 0,
      },
    };
    let terms = [];

    // 1. Fetch Terms for counts
    try {
      const termsRes = await TermService.getAll({ PageNumber: 1, PageSize: 100 });
      const termsData = termsRes?.data || termsRes;
      terms = termsData?.items || [];

      // Native BE Aggregation: Sum up counts from all terms
      terms.forEach((term) => {
        stats.totalStudents += term.totalEnrolled || 0;
        stats.totalPlaced += term.totalPlaced || 0;
        stats.totalGroups += term.totalGroups || 0;

        // Status counts
        const status = Number(term.status);
        if (status === 1) stats.statusCounts.upcoming++;
        else if (status === 2) stats.statusCounts.active++;
        else if (status === 3) stats.statusCounts.ended++;
        else if (status === 4) stats.statusCounts.closed++;
      });

      // Count total terms count from pagination metadata
      const finalTermsData = termsData?.data || termsData;
      stats.totalTerms = finalTermsData?.totalCount || terms.length;
    } catch (e) {
      console.warn('Dashboard stats: terms fetch failed', e);
    }

    return { stats, terms: terms.slice(0, 20) };
  },
};
