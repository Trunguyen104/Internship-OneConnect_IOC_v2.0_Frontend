import { httpGet } from '@/services/http-client.service';

export const DashboardService = {
  getSelfApplyApplications(params = {}) {
    return httpGet('/applications/self-apply', { PageSize: 50, ...params }, { silent: true });
  },
  getUniAssignApplications(params = {}) {
    return httpGet('/applications/uni-assign', { PageSize: 50, ...params }, { silent: true });
  },
  getInternshipGroups(params = {}) {
    return httpGet('/internship-groups', { PageSize: 50, ...params }, { silent: true });
  },
  getPlacedStudents(params = {}) {
    return httpGet(
      '/internship-groups/placed-students',
      { PageSize: 50, ...params },
      { silent: true }
    );
  },
  getInternshipPhases(params = {}) {
    return httpGet('/internship-phases', { PageSize: 50, ...params }, { silent: true });
  },
  getProjects() {
    return httpGet('/projects', { PageSize: 50 }, { silent: true });
  },
  getNotifications() {
    return httpGet('/notifications/notifications', { PageSize: 10 }, { silent: true });
  },
  getAdminDashboard() {
    return httpGet('/enterprise-admin/dashboard', {}, { silent: true });
  },
};
