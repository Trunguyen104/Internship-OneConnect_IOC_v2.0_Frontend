// // src/services/httpClient.js

// // Từ giờ luôn gọi qua Next proxy
// const API_BASE = '/api/proxy';

// async function request(path, options = {}) {
//   const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
//   const res = await fetch(`${API_BASE}${path}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   const contentType = res.headers.get('content-type');
//   // const data =
//   //   contentType && contentType.includes('application/json') ? await res.json() : await res.text();
//   let data = null;

//   // ✅ PARSE JSON AN TOÀN
//   if (contentType && contentType.includes('application/json')) {
//     const text = await res.text();
//     data = text ? JSON.parse(text) : null;
//   } else {
//     data = await res.text();
//   }
//   if (!res.ok) {
//     return {
//       isSuccess: false,
//       status: res.status,
//       data,
//     };
//   }

//   return data;
// }

// export const httpGet = (path, options) => request(path, { method: 'GET', ...options });

// export const httpPost = (path, body, options = {}) =>
//   request(path, {
//     method: 'POST',
//     body: JSON.stringify(body),
//     ...options,
//   });

// export const httpPut = (path, body, options = {}) =>
//   request(path, {
//     method: 'PUT',
//     body: JSON.stringify(body),
//     ...options,
//   });

// export const httpDelete = (path, options) => request(path, { method: 'DELETE', ...options });

// export const httpPatch = (path, body, options = {}) =>
//   request(path, {
//     method: 'PATCH',
//     body: JSON.stringify(body),
//     ...options,
//   });

// export default {
//   httpGet,
//   httpPost,
//   httpPut,
//   httpDelete,
//   httpPatch,
// };

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

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
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

export const httpPatch = (path, body, options = {}) =>
  request(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  });

export default {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  httpPatch,
};
