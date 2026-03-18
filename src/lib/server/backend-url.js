const DEFAULT_DEV_BE_URL = 'http://localhost:5050';
const DEFAULT_DOCKER_BE_URL = 'http://backend:8080';

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, '');
}

export function resolveBackendBaseUrl() {
  const configuredUrl =
    process.env.BE_URL?.trim() || process.env.BACKEND_URL?.trim() || process.env.API_URL?.trim();

  if (configuredUrl) {
    return normalizeBaseUrl(configuredUrl);
  }

  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_DOCKER_BE_URL;
  }

  return DEFAULT_DEV_BE_URL;
}

export function resolveApiRoot() {
  const baseUrl = resolveBackendBaseUrl();

  if (/\/api\/v\d+\/auth$/i.test(baseUrl)) {
    return baseUrl.replace(/\/v\d+\/auth$/i, '');
  }

  if (/\/api\/auth$/i.test(baseUrl)) {
    return baseUrl.replace(/\/auth$/i, '');
  }

  if (/\/api\/v\d+$/i.test(baseUrl)) {
    return baseUrl.replace(/\/v\d+$/i, '');
  }

  if (/\/api$/i.test(baseUrl)) {
    return baseUrl;
  }

  return `${baseUrl}/api`;
}

export function resolveAuthBaseUrl() {
  const baseUrl = resolveBackendBaseUrl();

  if (/\/api\/v\d+\/auth$/i.test(baseUrl)) {
    return baseUrl;
  }

  if (/\/api\/v\d+$/i.test(baseUrl)) {
    return `${baseUrl}/auth`;
  }

  if (/\/api$/i.test(baseUrl)) {
    return `${baseUrl}/v1/auth`;
  }

  return `${baseUrl}/api/v1/auth`;
}
