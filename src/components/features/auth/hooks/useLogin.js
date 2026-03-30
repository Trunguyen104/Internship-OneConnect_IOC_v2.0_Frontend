'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { login } from '@/components/features/auth/services/auth.service';
import { AUTH_MESSAGES } from '@/constants/auth/uiText';
import { USER_ROLE } from '@/constants/common/enums';
import { useToast } from '@/providers/ToastProvider';
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
      const role =
        typeof rawRole === 'number'
          ? rawRole
          : typeof rawRole === 'string'
            ? rawRole.trim().toLowerCase()
            : undefined;

      if (
        role === USER_ROLE.SUPER_ADMIN ||
        role === 'superadmin' ||
        role === 'super_admin' ||
        role === USER_ROLE.MODERATOR ||
        role === 'moderator'
      ) {
        router.push('/user-management');
        return;
      }

      if (role === USER_ROLE.SCHOOL_ADMIN || role === 'schooladmin') {
        router.push('/admin-dashboard');
        return;
      }

      if (
        role === USER_ROLE.ENTERPRISE_ADMIN ||
        role === 'enterpriseadmin' ||
        role === USER_ROLE.HR ||
        role === 'hr' ||
        role === USER_ROLE.MENTOR ||
        role === 'mentor'
      ) {
        router.push('/dashboard');
        return;
      }

      if (role === USER_ROLE.STUDENT || role === 'student') {
        router.push('/internship-groups');
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
