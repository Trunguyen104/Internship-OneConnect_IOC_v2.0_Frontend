'use client';

import { useQueryClient } from '@tanstack/react-query';

import { clearAuth } from '@/components/features/auth/lib/auth-storage';
import { logout as authLogout } from '@/components/features/auth/services/auth.service';
import { useToast } from '@/providers/ToastProvider';

/**
 * Custom hook to handle secure logout by clearing API sessions,
 * local auth storage, and TanStack Query cache.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const logout = async (successMessage = 'Logout successfully') => {
    try {
      // 1. Invalidate session on server
      await authLogout();

      // 2. Clear local auth metadata
      clearAuth();

      // 3. Clear ALL TanStack Query cache to prevent data leakage between users
      queryClient.clear();

      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, we should clear local state for security
      clearAuth();
      queryClient.clear();
    } finally {
      // 4. Redirect to login with a full page reload to ensure all memory state (Zustand, Query, etc.) is truly gone.
      window.location.href = '/login';
    }
  };

  return { logout };
};
