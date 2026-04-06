'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { clearAuth } from '@/components/features/auth/lib/auth-storage';
import { AUTH_SESSION_QUERY_KEY } from '@/hooks/useSession';
import { AUTH_SESSION_REFRESHED_EVENT } from '@/lib/auth/session-events';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthEventsProvider({ children }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const onSessionRefreshed = () => {
      queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
    };

    window.addEventListener(AUTH_SESSION_REFRESHED_EVENT, onSessionRefreshed);
    return () => window.removeEventListener(AUTH_SESSION_REFRESHED_EVENT, onSessionRefreshed);
  }, [queryClient]);

  useEffect(() => {
    const onUnauthorized = () => {
      if (typeof window === 'undefined') return;
      if (window.location.pathname === '/login') return;

      clearAuth();
      queryClient.removeQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
      const returnTo = `${window.location.pathname}${window.location.search || ''}`;
      router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    };

    const onForbidden = () => {
      if (typeof window === 'undefined') return;
      if (window.location.pathname === '/unauthorized') return;

      // RACE CONDITION FIX: Avoid redirecting if the user role is still being loaded
      // or if we just hot-reloaded and the store is temporarily empty.
      const currentUser = useAuthStore.getState().user;
      if (!currentUser || !currentUser.role) {
        console.warn(
          '[AuthEventsProvider] 403 received but user role is unknown. Skipping global redirect to avoid false positives during load.'
        );
        return;
      }

      const returnTo = `${window.location.pathname}${window.location.search || ''}`;
      router.replace(`/unauthorized?returnTo=${encodeURIComponent(returnTo)}`);
    };

    window.addEventListener('auth:unauthorized', onUnauthorized);
    window.addEventListener('auth:forbidden', onForbidden);
    return () => {
      window.removeEventListener('auth:unauthorized', onUnauthorized);
      window.removeEventListener('auth:forbidden', onForbidden);
    };
  }, [router, queryClient]);

  return children;
}

export default AuthEventsProvider;
