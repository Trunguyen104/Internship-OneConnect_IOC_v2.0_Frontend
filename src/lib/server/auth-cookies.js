import { AUTH_COOKIE_ACCESS, AUTH_COOKIE_REFRESH } from '@/lib/auth/cookie-names';

/**
 * BFF session cookies: HttpOnly, not readable from browser JS (`document.cookie`).
 *
 * - `secure`: ON in production (HTTPS).
 * - `sameSite`: `none` in production when frontend and API may be cross-site (requires `secure`);
 *   `lax` in development on http://localhost.
 *
 * Tokens never appear in JSON from login/refresh except the SignalR bridge (`POST /api/auth/token`).
 */
export function buildAuthCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };
}

export function applySessionCookies(
  response,
  accessToken,
  refreshToken,
  accessMaxAge,
  refreshMaxAge
) {
  const base = buildAuthCookieOptions();

  if (accessToken) {
    response.cookies.set(AUTH_COOKIE_ACCESS, accessToken, {
      ...base,
      maxAge: accessMaxAge,
    });
  }

  if (refreshToken) {
    response.cookies.set(AUTH_COOKIE_REFRESH, refreshToken, {
      ...base,
      maxAge: refreshMaxAge,
    });
  }
}

/** Clear both cookies (logout / failed refresh). */
export function clearSessionCookies(response) {
  const clear = {
    ...buildAuthCookieOptions(),
    maxAge: 0,
  };
  response.cookies.set(AUTH_COOKIE_ACCESS, '', clear);
  response.cookies.set(AUTH_COOKIE_REFRESH, '', clear);
}
