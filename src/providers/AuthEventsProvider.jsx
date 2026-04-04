'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

export function AuthEventsProvider({ children }) {
  const router = useRouter();

  useEffect(() => {
    const onUnauthorized = () => {
      if (typeof window === 'undefined') return;
      if (window.location.pathname === '/login') return;

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
  }, [router]);

  return children;
}

export default AuthEventsProvider;
