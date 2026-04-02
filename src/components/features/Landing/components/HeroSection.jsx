'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { USER_ROLE } from '@/constants/common/enums';
import { LANDING_UI } from '@/constants/landing/uiText';
import { useAuthStore } from '@/store/useAuthStore';

export function HeroSection() {
  const { user } = useAuthStore();

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
    <section className="relative flex flex-col items-center justify-center pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50/50">
      <div className="absolute top-0 -z-10 h-full w-full overflow-hidden opacity-40">
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] h-[400px] w-[400px] rounded-full bg-blue-100 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center">
        <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
          {LANDING_UI.HERO.TITLE}
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
          {LANDING_UI.HERO.DESCRIPTION}
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {user ? (
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-primary-hover active:scale-95"
            >
              {LANDING_UI.HERO.BUTTON_DASHBOARD}
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-primary px-10 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-primary-hover active:scale-95"
            >
              {LANDING_UI.HERO.BUTTON_JOIN}
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
