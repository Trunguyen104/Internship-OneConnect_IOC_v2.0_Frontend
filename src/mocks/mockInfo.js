import info from './data/generalinfo.mock.json';
import { CONFIG } from '@/constants/common/config';

export async function getGeneralInfo() {
  if (CONFIG.useMocks) {
    return info;
  }

  // return httpGet('/general-info');
}
