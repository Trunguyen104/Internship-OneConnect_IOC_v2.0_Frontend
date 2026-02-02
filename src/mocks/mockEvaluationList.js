import data from './data/evaluation.mock.json';
import { CONFIG } from '@/constants/config';

export async function getEvaluationList() {
  if (CONFIG.useMocks) {
    return { data };
  }

  // return httpGet('/evaluations');
}
