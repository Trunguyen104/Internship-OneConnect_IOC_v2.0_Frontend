/** Dispatched after BFF `PUT /api/auth` (refresh) succeeds so React Query can resync session. */
export const AUTH_SESSION_REFRESHED_EVENT = 'auth:session-refreshed';

export function dispatchSessionRefreshed() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event(AUTH_SESSION_REFRESHED_EVENT));
  } catch {
    // no-op
  }
}
