import info from './data/generalinfo.mock.json';
import { CONFIG } from '@/constants/config';

export async function getGeneralInfo() {
  if (CONFIG.useMocks) {
    return info;
  }

  // sau này mới dùng API
  // return httpGet('/general-info');
}
