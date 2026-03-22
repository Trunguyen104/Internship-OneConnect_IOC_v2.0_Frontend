// // export default httpClient;
const API_BASE = '/api/proxy';

async function request(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Token is now handled server-side in the proxy route via HttpOnly cookies.
  // We do NOT attach it here to prevent XSS/Token Leakage.

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  let data = null;

  if (options.responseType === 'blob') {
    data = await res.blob();
  } else if (contentType && contentType.includes('application/json')) {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      try {
        const refreshRes = await fetch('/api/auth', {
          method: 'PUT',
          credentials: 'include',
        });

        if (refreshRes.ok) {
          // Retry logic without client-side token attachment
          const retryRes = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers,
          });

          if (!retryRes.ok) {
            const errorData = await retryRes.text();
            throw new Error(errorData || 'Request failed after refresh');
          }

          if (options.responseType === 'blob') return await retryRes.blob();
          const retryContentType = retryRes.headers.get('content-type');
          if (retryContentType && retryContentType.includes('application/json')) {
            return await retryRes.json();
          }
          return await retryRes.text();
        }
      } catch {
        // Silent: caller will handle the 401/refresh failure via thrown error below.
      }
    }

    // Standardize error shape by throwing
    const error = new Error(
      typeof data === 'string' ? data : data?.message || `Request failed with status ${res.status}`
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// export const httpGet = (path, options) => request(path, { method: 'GET', ...options });
export const httpGet = (path, params = {}, options = {}) => {
  // Filter out undefined and null values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  );

  const query = new URLSearchParams(cleanParams).toString();
  const url = query ? `${path}?${query}` : path;

  return request(url, { method: 'GET', ...options });
};
// export const httpDelete = (path, options) => request(path, { method: 'DELETE', ...options });
export const httpDelete = (path, body, options = {}) =>
  request(path, {
    method: 'DELETE',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
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
const httpClient = {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  httpPatch,
};

export default httpClient;
