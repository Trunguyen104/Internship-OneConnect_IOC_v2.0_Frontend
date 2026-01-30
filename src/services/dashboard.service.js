import { getDashboardMock } from "@/mocks/mockServer";
import { CONFIG } from "@/constants/config";
import { httpGet } from "@/services/httpClient";

export async function getDashboardData() {
  if (CONFIG.useMocks) {
    return getDashboardMock();
  }

  return httpGet("/api/dashboard"); // backend sau này
}
