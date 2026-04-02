'use client';

import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { refreshToken } from '@/components/features/auth/services/auth.service';
import { UI_TEXT } from '@/lib/UI_Text';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * AuthGuard
 * Ensures the user has a valid session and the exact roles required to view the page.
 * Mirrors the robust RBAC architecture from quan-ly-nha-hang-fe.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children The isolated layout content
 * @param {Array<string|number>} props.allowedRoles Array of roles allowed to view this
 */
export default function AuthGuard({ children, allowedRoles = [] }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      // 1. FAST PATH: Check if we already have the local user from login / persist
      if (user?.role) {
        if (allowedRoles.length > 0) {
          const hasAccess = allowedRoles.some(
            (r) => String(r).toLowerCase() === String(user.role).toLowerCase()
          );
          if (!hasAccess) {
            router.replace('/login');
            return;
          }
        }
        setChecking(false);
        return;
      }

      // 2. SLOW PATH: User hit F5 with empty localStorage but valid tokens
      try {
        // Attempt to refresh token internally via Next.js API, this effectively
        // acts like an /auth/me call, fetching the HttpOnly session role.
        const res = await refreshToken();

        if (res.success && res.role) {
          if (!cancelled) {
            setUser({ role: res.role });

            // RBAC Check
            if (allowedRoles.length > 0) {
              const hasAccess = allowedRoles.some(
                (role) => String(role).toLowerCase() === String(res.role).toLowerCase()
              );
              if (!hasAccess) {
                console.warn('[AuthGuard] Unauthorized access attempt for role:', res.role);
                router.replace('/login'); // Or send to a 403 page
                return;
              }
            }
          }
        } else {
          clearUser();
          router.replace('/login');
        }
      } catch (err) {
        console.error('[AuthGuard] Session verification failed:', err);
        clearUser();
        router.replace('/login');
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [router, setUser, clearUser, allowedRoles]); // Only run on mount or role requirement change

  if (checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <p className="text-sm font-medium tracking-tight text-gray-500 animate-pulse">
            {UI_TEXT.COMMON.VERIFY_SESSION}
          </p>
        </div>
      </div>
    );
  }

  // Double check user exists before rendering secure layout
  return user ? <>{children}</> : null;
}
