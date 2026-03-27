import { CONFIG } from '@/constants/common/config';
import { getDashboardMock } from '@/mocks/mockServer';
import { httpGet } from '@/services/http-client.service';

export async function getDashboardData(internshipGroupId) {
  // 1ï¸âƒ£ Náº¿u Ä‘ang dev â†’ dÃ¹ng mock
  if (CONFIG.useMocks) {
    return getDashboardMock();
  }

  // 2ï¸âƒ£ Khi backend cÃ³ â†’ gá»i API tháº­t qua proxy Next
  return httpGet(`/internship-groups/${internshipGroupId}/dashboard`);
}
