const ACCESS_TOKEN_KEY = 'accessToken';

export function setAccessToken(token) {
  // REMOVED: Tokens are now handled via HttpOnly cookies for security
}

export function getAccessToken() {
  // REMOVED: Accessing tokens from JS is disabled to prevent XSS
  return null;
}

export function clearAuth() {
  // REMOVED: Auth state is managed via cookies
}
