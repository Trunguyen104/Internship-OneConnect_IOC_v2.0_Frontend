import { httpGet } from '@/services/http-client.service';

export async function getDashboardData(internshipGroupId) {
  return httpGet(`/internship-groups/${internshipGroupId}/dashboard`);
}
