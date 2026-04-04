import { httpGet } from '@/services/http-client.service';

export const DashboardService = {
  getSelfApplyApplications() {
    return httpGet('/applications/self-apply', { PageSize: 50 }, { silent: true });
  },
  getUniAssignApplications() {
    return httpGet('/applications/uni-assign', { PageSize: 50 }, { silent: true });
  },
  getInternshipGroups() {
    return httpGet('/internship-groups', { PageSize: 50 }, { silent: true });
  },
  getPlacedStudents() {
    return httpGet('/internship-groups/placed-students', { PageSize: 50 }, { silent: true });
  },
  getInternshipPhases() {
    return httpGet('/internship-phases', { PageSize: 50 }, { silent: true });
  },
  getProjects() {
    return httpGet('/projects', { PageSize: 50 }, { silent: true });
  },
  getNotifications() {
    return httpGet('/notifications/notifications', { PageSize: 10 }, { silent: true });
  },
};
