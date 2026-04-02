'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { login } from '@/components/features/auth/services/auth.service';
import { AUTH_MESSAGES } from '@/constants/auth/uiText';
import { USER_ROLE } from '@/constants/common/enums';
import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { validateLogin } from '@/validators/auth';

export function useLogin() {
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('rememberEmail');

      if (savedEmail) {
        return {
          email: savedEmail,
          password: '',
          rememberMe: true,
        };
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

      const rawRole = auth?.role;
      // Populate global RBAC state so AuthGuard doesn't kick the user out
      useAuthStore.getState().setUser({
        email: auth?.email,
        role: rawRole,
        unitId: auth?.unitId,
      });
      const role = Number(auth?.role);

      // 1. Super Admin & Moderator
      if (role === USER_ROLE.SUPER_ADMIN || role === USER_ROLE.MODERATOR) {
        router.push('/admin/dashboard');
        return;
      }

      // 2. University Admin
      if (role === USER_ROLE.SCHOOL_ADMIN) {
        router.push('/school/home');
        return;
      }

      // 3. Enterprise / HR / Mentor
      if (
        role === USER_ROLE.ENTERPRISE_ADMIN ||
        role === USER_ROLE.HR ||
        role === USER_ROLE.MENTOR
      ) {
        router.push('/company/home');
        return;
      }

      // 4. Student & Others
      router.push('/student/home');
    } catch (err) {
      setErrors({ password: err.message });
      toast.error(AUTH_MESSAGES.TOAST.LOGIN_FAILED);
    }
  };

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

  return { form, errors, handleChange, handleSubmit };
}
