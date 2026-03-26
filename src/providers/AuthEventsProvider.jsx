'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
