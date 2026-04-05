import { StudentService } from '@/components/features/internship-enrollment-management/services/student.service';
import { TermService } from '@/components/features/internship-term-management/services/term.service';
import { userService } from '@/components/features/user/services/user.service';

export const DashboardService = {
  async getProfile() {
    return userService.getMe();
  },

  async getStats(termId = null) {
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

    try {
      if (termId) {
        // Mode: Single Term Stats
        const termRes = await TermService.getById(termId);
        const term = termRes?.data || termRes;

        if (term) {
          // Fetch accurate student count even for single term
          try {
            const enrollRes = await StudentService.getAll(termId, { pageSize: 1 });
            term.totalEnrolled = enrollRes?.data?.totalCount ?? term.totalEnrolled;
          } catch (e) {
            console.warn('Dashboard stats: single term enroll fetch failed', e);
          }

          stats.totalStudents = Number(term.totalEnrolled) || 0;
          stats.totalPlaced = Number(term.totalPlaced) || 0;
          stats.totalGroups = Number(term.totalGroups) || 0;
          stats.totalTerms = 1;

          const status = Number(term.status);
          if (status === 1) stats.statusCounts.upcoming = 1;
          else if (status === 2) stats.statusCounts.active = 1;
          else if (status === 3) stats.statusCounts.ended = 1;
          else if (status === 4) stats.statusCounts.closed = 1;

          terms = [term];
        }
      } else {
        // Mode: Global Dashboard Stats (Existing Logic)
        const termsRes = await TermService.getAll({ PageNumber: 1, PageSize: 100 });
        const termsData = termsRes?.data || termsRes;
        const rawTerms = termsData?.items || [];

        const termDetails = await Promise.all(
          rawTerms.map(async (term) => {
            try {
              const enrollRes = await StudentService.getAll(term.termId, { pageSize: 1 });
              return {
                ...term,
                totalEnrolled: enrollRes?.data?.totalCount ?? term.totalEnrolled,
              };
            } catch {
              return term;
            }
          })
        );

        terms = termDetails;

        terms.forEach((term) => {
          stats.totalStudents += Number(term.totalEnrolled) || 0;
          stats.totalPlaced += Number(term.totalPlaced) || 0;
          stats.totalGroups += Number(term.totalGroups) || 0;

          const status = Number(term.status);
          if (status === 1) stats.statusCounts.upcoming++;
          else if (status === 2) stats.statusCounts.active++;
          else if (status === 3) stats.statusCounts.ended++;
          else if (status === 4) stats.statusCounts.closed++;
        });

        const finalTermsData = termsData?.data || termsData;
        stats.totalTerms = finalTermsData?.totalCount || terms.length;
      }
    } catch (e) {
      console.warn('Dashboard stats fetch failed', e);
    }

    return { stats, terms: terms.slice(0, 20) };
  },
};
