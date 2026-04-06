'use client';

import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { login } from '@/components/features/auth/services/auth.service';
import Input from '@/components/ui/input';
import { AUTH_MESSAGES, AUTH_UI } from '@/constants/auth/uiText';
import { USER_ROLE } from '@/constants/common/enums';
import { AUTH_SESSION_QUERY_KEY } from '@/hooks/useSession';
import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { validateLogin } from '@/validators/auth';

/**
 * LoginPage
 * Consolidated entry point for the authentication flow.
 * Combines logic, header, and form into a single file for better maintainability for this feature.
 */
export default function LoginPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Login Logic ---
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('rememberEmail');
      if (savedEmail) {
        return { email: savedEmail, password: '', rememberMe: true };
      }
    }
    return { email: '', password: '', rememberMe: false };
  });

  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const validationErrors = validateLogin(form);
    const mappedErrors = {};
    Object.keys(validationErrors).forEach((key) => {
      mappedErrors[key] = AUTH_MESSAGES.VALIDATION[validationErrors[key]];
    });
    setErrors(mappedErrors);
    return Object.keys(mappedErrors).length === 0;
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const auth = await login(form);

      if (form.rememberMe) {
        localStorage.setItem('rememberEmail', form.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      toast.success(AUTH_MESSAGES.TOAST.LOGIN_SUCCESS);

      useAuthStore.getState().setUser({
        email: auth?.email,
        role: auth?.role,
        unitId: auth?.unitId,
      });

      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });

      const returnTo = searchParams.get('returnTo');
      if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('/login')) {
        router.push(returnTo);
        return;
      }

      const role = Number(auth?.role);
      if (role === USER_ROLE.SUPER_ADMIN) {
        router.push('/admin/dashboard');
      } else if (role === USER_ROLE.SCHOOL_ADMIN) {
        router.push('/school/home');
      } else if (
        role === USER_ROLE.ENTERPRISE_ADMIN ||
        role === USER_ROLE.HR ||
        role === USER_ROLE.MENTOR
      ) {
        router.push('/company/home');
      } else {
        router.push('/student/home');
      }
    } catch (err) {
      setErrors({ password: err.message });
      toast.error(AUTH_MESSAGES.TOAST.LOGIN_FAILED);
    }
  };

  return (
    <>
      {/* Header Section */}
      <Image
        src="/assets/images/logo.svg"
        alt={AUTH_UI.LABELS.LOGO}
        width={200}
        height={60}
        className="mx-auto mb-8 block"
      />
      <h1 className="mb-4 text-center text-4xl font-bold text-black">{AUTH_UI.LOGIN.TITLE}</h1>
      <p className="mb-8 text-center text-gray-500">{AUTH_UI.LOGIN.WELCOME}</p>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
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
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
            />
            {AUTH_UI.LOGIN.REMEMBER_LOGIN}
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-(--primary-700) hover:underline"
          >
            {AUTH_UI.LOGIN.FORGOT_PASSWORD_LINK}
          </Link>
        </div>

        <button
          type="submit"
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-(--color-primary) font-semibold text-white transition-all hover:bg-(--color-primary-hover) active:scale-[0.98]"
        >
          {AUTH_UI.LOGIN.BUTTON}
        </button>

        <div className="mt-6 text-center text-xs text-gray-400">{AUTH_UI.LOGIN.COPYRIGHT}</div>
      </form>
    </>
  );
}
