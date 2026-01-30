import { CONFIG } from '@/constants/config';

export async function httpGet(url, options = {}) {
  const res = await fetch(`${CONFIG.apiUrl}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error('HTTP GET error');
  }

  return res.json();
}
