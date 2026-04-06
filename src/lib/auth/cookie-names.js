/**
 * Canonical names for auth cookies set by the Next.js BFF (`/api/auth/*`).
 * HttpOnly: never exposed to `document.cookie` — read only on the server / in Route Handlers.
 */
export const AUTH_COOKIE_ACCESS = 'accessToken';
export const AUTH_COOKIE_REFRESH = 'refreshToken';
