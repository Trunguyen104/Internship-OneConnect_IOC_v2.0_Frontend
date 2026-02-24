// src/services/httpClient.js

// Từ giờ luôn gọi qua Next proxy
const API_BASE = '/api/proxy';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = '';
    try {
      message = await res.text();
    } catch {}
    throw new Error(`API error ${res.status}: ${message}`);
  }

  // nếu response không phải JSON (file download...) thì vẫn an toàn
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }

  return res;
}

// ===== helper methods =====
export const httpGet = (path, options) => request(path, { method: 'GET', ...options });

export const httpPost = (path, body, options = {}) =>
  request(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });

export const httpPut = (path, body, options = {}) =>
  request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  });

export const httpDelete = (path, options) => request(path, { method: 'DELETE', ...options });

export default {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
};
