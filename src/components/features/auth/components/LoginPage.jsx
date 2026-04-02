'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLogin } from '@/components/features/auth/hooks/useLogin';
import Input from '@/components/ui/input';
import { AUTH_UI } from '@/constants/auth/uiText';

export default function LoginPage() {
  const { form, errors, isLoading, handleChange, handleSubmit } = useLogin();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  return (
    <div
      id="login-page-root"
      data-hydrated={isHydrated}
      className="h-screen w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at top left, var(--primary-100) 0%, var(--color-surface) 65%)',
      }}
    >
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex items-center justify-center px-4 lg:pr-1">
          <div className="w-full max-w-125">
            <Image
              src="/assets/images/logo.svg"
              alt={AUTH_UI.LABELS.LOGO}
              width={200}
              height={60}
              className="mx-auto mb-8 block"
            />

            <p className="mb-4 text-center text-4xl font-bold text-black">{AUTH_UI.LOGIN.TITLE}</p>

            <p className="mb-8 text-center text-gray-500">{AUTH_UI.LOGIN.WELCOME}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={AUTH_UI.LABELS.EMAIL}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={AUTH_UI.LABELS.EMAIL_PLACEHOLDER}
                error={errors.email}
              />

              <Input
                label={AUTH_UI.LABELS.PASSWORD}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                  />
                  {AUTH_UI.LOGIN.REMEMBER_LOGIN}
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-(--primary-700) hover:underline"
                >
                  {AUTH_UI.LOGIN.FORGOT_PASSWORD_LINK}
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full cursor-pointer rounded-xl bg-(--color-primary) font-semibold text-white hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? AUTH_UI.LOGIN.BUTTON_LOADING || 'Logging in...' : AUTH_UI.LOGIN.BUTTON}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">{AUTH_UI.LOGIN.COPYRIGHT}</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden items-center justify-center p-8 lg:flex">
          <div className="flex h-full max-h-[90vh] w-full max-w-175 flex-col items-center justify-between rounded-4xl bg-(--color-danger) px-10 py-12 shadow-xl">
            <div className="text-center text-white">
              <h2 className="mb-4 text-4xl font-extrabold">{AUTH_UI.BRANDING.TITLE}</h2>

              <p className="mx-auto max-w-105 text-sm text-white/80">
                {AUTH_UI.BRANDING.DESCRIPTION}
              </p>
            </div>

            <Image
              src="/assets/images/bg.png"
              alt={AUTH_UI.LABELS.MASCOT}
              width={400}
              height={400}
              className="rounded-xl object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
