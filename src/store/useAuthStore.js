import { create } from 'zustand';

/**
 * Client UI snapshot only (role, email, unitId). Authoritative auth is HttpOnly cookies + server layouts.
 * Not persisted: avoids stale role/email in localStorage after logout or token rotation.
 */
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));
