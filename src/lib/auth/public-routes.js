/**
 * Public HTTP paths (no auth redirect in middleware).
 * Keep in sync with `SESSION_SKIP_PATHS` + landing `/`.
 */
export const PUBLIC_ROUTE_PATHS = [
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
];

/**
 * Where the client skips `GET /api/auth` (login/error flows). Landing `/` still loads session.
 */
export const SESSION_SKIP_PATHS = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
];
