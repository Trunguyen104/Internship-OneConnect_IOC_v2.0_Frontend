'use client';

import Image from 'next/image';
import Link from 'next/link';

import { USER_ROLE } from '@/constants/common/enums';
import { LANDING_UI } from '@/constants/landing/uiText';
import { useAuthStore } from '@/store/useAuthStore';

export function Navbar() {
  const { user } = useAuthStore();

  // useAuthStore uses persist middleware, so the user state is automatically loaded from localStorage.
  // No need for an explicit fetchUser call on mount in the Navbar.

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/components/features/auth/services/auth.service');
      await logout();
      useAuthStore.getState().clearUser();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: clear store even if API fails
      useAuthStore.getState().clearUser();
      window.location.href = '/';
    }
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

          {user ? (
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
          )}
        </div>
      </div>
    </nav>
  );
}
