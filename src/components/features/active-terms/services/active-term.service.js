import httpClient from '@/services/httpClient';

const activeTermService = {
  /**
   * Fetch all active internship terms.
   * @returns {Promise<Array>} List of terms.
   */
  getActiveTerms: async () => {
    // For Enterprise/Mentor, we fetch the internship groups they belong to
    // and extract the term information from there to bypass university requirements.
    const res = await httpClient.httpGet('/mine');
    const groups = res?.data?.content || res?.content || res?.data || res || [];

    // Extract unique terms from groups
    const termsMap = new Map();
    groups.forEach((group) => {
      if (group.internshipTerm) {
        termsMap.set(group.internshipTerm.id, group.internshipTerm);
      } else if (group.term) {
        termsMap.set(group.term.id, group.term);
      }
    });

    return Array.from(termsMap.values());
  },

  /**
   * Fetch all evaluation cycles for the current user.
   */
  getEvaluationCycles: async () => {
    try {
      const res = await httpClient.httpGet('/mine/evaluations/cycles');
      return res?.data?.content || res?.content || res?.data || res || [];
    } catch (e) {
      console.warn('Evaluation cycles fetch failed, potentially not applicable for this role', e);
      return [];
    }
  },
};

export default activeTermService;
