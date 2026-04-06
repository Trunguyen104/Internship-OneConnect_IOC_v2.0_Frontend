import { useAuthStore } from '@/store/useAuthStore';

/** Access tokens live in HttpOnly cookies set by `/api/auth`; never in localStorage or JS-accessible cookies. */
export function setAccessToken() {
  // Handled via HttpOnly cookies
}

export function getAccessToken() {
  return null;
}

export function clearAuth() {
  useAuthStore.getState().clearUser();
}
