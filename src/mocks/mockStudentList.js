import students from './data/studentlist.mock.json';
import { CONFIG } from '@/constants/config';
import { httpGet } from '@/services/httpClient';

export async function getStudentList() {
  if (CONFIG.useMocks) {
    return {
      data: students,
      total: students.length,
    };
  }

  return httpGet('/api/students');
}
