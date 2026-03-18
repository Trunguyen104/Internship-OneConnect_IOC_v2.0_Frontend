'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/components/features/auth/services/authService';
import { useToast } from '@/providers/ToastProvider';
import { AUTH_MESSAGES } from '@/constants/auth/uiText';
import { validateLogin } from '@/validators/auth';

import { USER_ROLE } from '@/constants/common/enums';

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
      const role =
        typeof rawRole === 'number'
          ? rawRole
          : typeof rawRole === 'string'
            ? rawRole.trim().toLowerCase()
            : undefined;

      if (role === 1 || role === 'superadmin' || role === 'super_admin') {
        router.push('/admin-users');
        return;
      }
      if (role === 2 || role === 'moderator') {
        router.push('/admin-users');
        return;
      }
      if (role === 3 || role === 'schooladmin') {
        router.push('/admin-dashboard');
        return;
      }
      if (role === 4 || role === 'enterpriseadmin') {
        router.push('/dashboard');
        return;
      }

      router.push('/internship-groups');
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
