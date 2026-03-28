import { CONFIG } from '@/constants/common/config';
import { getDashboardMock } from '@/mocks/mockServer';
import { httpGet } from '@/services/http-client.service';

export async function getDashboardData(internshipGroupId) {
  // 1️⃣ Nếu đang dev → dùng mock
  if (CONFIG.useMocks) {
    return getDashboardMock();
  }

  // 2️⃣ Khi backend có → gọi API thật qua proxy Next
  return httpGet(`/internship-groups/${internshipGroupId}/dashboard`);
}
