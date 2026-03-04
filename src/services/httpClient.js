// // export default httpClient;
const API_BASE = '/api/proxy';

async function request(path, options = {}) {
  let token = null;

  if (typeof window !== 'undefined') {
    const raw = sessionStorage.getItem('accessToken');

    if (raw) {
      try {
        if (raw.startsWith('ey')) {
          token = raw;
        } else {
          const parsed = JSON.parse(raw);
          token = parsed?.accessToken || parsed?.data?.accessToken || null;
        }
      } catch {
        token = null;
      }
    }
  }

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const contentType = res.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    return {
      isSuccess: false,
      status: res.status,
      data,
    };
  }

  return data;
}

export const httpGet = (path, options) => request(path, { method: 'GET', ...options });

export const httpDelete = (path, options) => request(path, { method: 'DELETE', ...options });

export const httpPost = (path, body, options = {}) =>
  request(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });

export const httpPut = (path, body, options = {}) =>
  request(path, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });

export const httpPatch = (path, body, options = {}) =>
  request(path, {
    method: 'PATCH',
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });
export default {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  httpPatch,
};
