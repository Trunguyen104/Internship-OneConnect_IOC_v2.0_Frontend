import { getDashboardMock } from '@/mocks/mockServer';
import { CONFIG } from '@/constants/config';
import { httpGet } from '@/services/httpClient';

export async function getDashboardData() {
  // 1️⃣ Nếu đang dev → dùng mock
  if (CONFIG.useMocks) {
    return getDashboardMock();
  }

  // 2️⃣ Khi backend có → gọi API thật qua proxy Next
  return httpGet('/dashboard');
}

