import { httpGet, httpPost } from '@/services/http-client.service';

export const PlacementService = {
  getUniAssignApplications(params = {}) {
    return httpGet('/applications/uni-assign', params);
  },

  getStudentsByTerm(params = {}) {
    const { termId, pageNumber, pageSize } = params;
    return httpGet('/uniassigns/students-by-term', {
      TermId: termId,
      PageNumber: pageNumber || 1,
      PageSize: pageSize || 10,
    });
  },

  getEligiblePhases(params = {}) {
    return httpGet('/uniassigns/enterprise-interphases', params);
  },

  assignStudent(command) {
    return httpPost('/uniassigns/quick-enterprise-assignment', command);
  },

  unassignSingle(command) {
    return httpPost('/uniassigns/unassign-single', command);
  },

  reassignSingle(command) {
    return httpPost('/uniassigns/reassign-single', command);
  },

  bulkAssign(command) {
    return httpPost('/uniassigns/bulk-enterprise-assignment', command);
  },

  reassignStudents(command) {
    return httpPost('/uniassigns/bulk-reassign-enterprise', command);
  },

  unassignStudents(command) {
    return httpPost('/uniassigns/bulk-unassign', command);
  },
};
