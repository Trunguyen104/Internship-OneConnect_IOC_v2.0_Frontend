import { httpGet } from '@/services/http-client.service';

export const DashboardService = {
  getSelfApplyApplications() {
    return httpGet('/applications/self-apply', { PageSize: 50 });
  },
  getUniAssignApplications() {
    return httpGet('/applications/uni-assign', { PageSize: 50 });
  },
  getInternshipGroups() {
    return httpGet('/internship-groups', { PageSize: 50 });
  },
  getPlacedStudents() {
    return httpGet('/internship-groups/placed-students', { PageSize: 50 });
  },
  getInternshipPhases() {
    return httpGet('/internship-phases', { PageSize: 50 });
  },
  getProjects() {
    return httpGet('/projects', { PageSize: 50 });
  },
  getNotifications() {
    return httpGet('/notifications/notifications', { PageSize: 10 });
  },
};
