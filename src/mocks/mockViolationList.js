import data from './data/violation.mock.json';
import { CONFIG } from '@/constants/config';

export async function getViolationList() {
  if (CONFIG.useMocks) {
    return {
      data,
    };
  }

  // return httpGet('/violations');
}
