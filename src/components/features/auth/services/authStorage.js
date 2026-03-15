const ACCESS_TOKEN_KEY = 'accessToken';

export function setAccessToken(token) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAuth() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}
