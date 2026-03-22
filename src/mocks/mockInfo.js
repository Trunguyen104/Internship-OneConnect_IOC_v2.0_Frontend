import { CONFIG } from '@/constants/common/config';

import info from './data/generalinfo.mock.json';

export async function getGeneralInfo() {
  if (CONFIG.useMocks) {
    return info;
  }

  // return httpGet('/general-info');
}
