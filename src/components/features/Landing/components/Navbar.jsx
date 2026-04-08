'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import { USER_ROLE } from '@/constants/common/enums';
import { LANDING_UI } from '@/constants/landing/uiText';
import { useLogout } from '@/hooks/useLogout';
import { useAuthStore } from '@/store/useAuthStore';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { user, clearUser } = useAuthStore();
  const { logout } = useLogout();

  useEffect(() => {
    // 1. Mark as mounted to prevent hydration mismatches

    const timer = setTimeout(() => setMounted(true), 0);

    // 2. On mount, if we have a user in store, verify session one time to avoid ghost sessions
    if (user) {
      userService.getMe().catch((err) => {
        if (err?.status === 401 || err?.Response?.status === 401) {
          clearUser();
        }
      });
    }

    return () => clearTimeout(timer);
  }, []); // Only once on component mount

  const handleLogout = async () => {
    // useLogout hook handles API call, store clearing, toast, and redirection.
    await logout('Logged out successfully');
  };

  const dashboardHref = user
    ? user.role === USER_ROLE.SUPER_ADMIN
      ? '/admin/dashboard'
      : user.role === USER_ROLE.ENTERPRISE_ADMIN || user.role === USER_ROLE.HR
        ? '/company/home'
        : user.role === USER_ROLE.SCHOOL_ADMIN
          ? '/school/home'
          : user.role === USER_ROLE.STUDENT
            ? '/student/home'
            : '/'
    : '/login';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-300 shadow-lg bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.svg"
            alt="OneConnect Logo"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            {LANDING_UI.NAVBAR.HOME}
          </Link>

          {mounted ? (
            user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={dashboardHref}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover"
                >
                  {LANDING_UI.NAVBAR.DASHBOARD}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
                >
                  {LANDING_UI.NAVBAR.LOGOUT}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover"
                >
                  {LANDING_UI.NAVBAR.LOGIN}
                </Link>
              </div>
            )
          ) : (
            // Skeleton while hydrating to prevent flickering
            <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-100" />
          )}
        </div>
      </div>
    </nav>
  );
}
