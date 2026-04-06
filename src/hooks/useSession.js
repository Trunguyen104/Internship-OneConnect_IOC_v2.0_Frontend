'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { getSession } from '@/components/features/auth/services/auth.service';
import { SESSION_SKIP_PATHS } from '@/lib/auth/public-routes';
import { normalizeRoleToId } from '@/lib/auth/role';
import { useAuthStore } from '@/store/useAuthStore';

export { SESSION_SKIP_PATHS };

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'];

function useSessionFetchEnabled() {
  const pathname = usePathname();
  return typeof pathname === 'string' && !SESSION_SKIP_PATHS.includes(pathname);
}

/**
 * Session snapshot from the BFF. Server layouts remain authoritative for RBAC;
 * this hydrates `useAuthStore` for client UI (header, etc.).
 */
export function useSession(options = {}) {
  const { enabled: enabledOverride } = options;
  const enabledByPath = useSessionFetchEnabled();
  const enabled = enabledOverride ?? enabledByPath;

  return useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: getSession,
    enabled,
    staleTime: 60 * 1000,
    retry: false,
  });
}

function useSyncAuthStoreFromSession(query) {
  const enabled = useSessionFetchEnabled();
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    if (!enabled) return;
    const data = query.data;
    if (data === undefined) return;

    if (data.authenticated) {
      const role = normalizeRoleToId(data.role);
      setUser({
        email: data.email,
        role: role ?? data.role,
        unitId: data.unitId,
      });
    } else {
      clearUser();
    }
  }, [enabled, query.data, setUser, clearUser]);
}

/**
 * Mount once under `ReactQueryProvider` to keep auth store aligned with HttpOnly cookie session.
 */
export function SessionProvider({ children }) {
  const query = useSession();
  useSyncAuthStoreFromSession(query);
  return children;
}
