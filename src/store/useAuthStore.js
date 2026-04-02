import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Holds { role, email, etc. }
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'ioc-auth-store', // persisted in localStorage for faster initial loads
    }
  )
);
