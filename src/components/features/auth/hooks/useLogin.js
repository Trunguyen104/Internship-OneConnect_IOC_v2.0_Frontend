'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/components/features/auth/services/authService';
import { setAccessToken } from '@/components/features/auth/services/authStorage';
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

    return {
      email: '',
      password: '',
      rememberMe: false,
    };
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
      const data = await login(form);

      if (form.rememberMe) {
        localStorage.setItem('rememberEmail', form.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      setAccessToken(data.accessToken);

      toast.success(AUTH_MESSAGES.TOAST.LOGIN_SUCCESS);

      // REDIRECT BASED ON ROLE
      switch (data.role) {
        case USER_ROLE.SUPER_ADMIN:
        case USER_ROLE.MODERATOR:
        case USER_ROLE.SCHOOL_ADMIN:
          router.push('/admin-dashboard');
          break;
        case USER_ROLE.ENTERPRISE_ADMIN:
        case USER_ROLE.HR:
          router.push('/dashboard');
          break;
        case USER_ROLE.MENTOR:
        case USER_ROLE.STUDENT:
        default:
          router.push('/internship-groups');
          break;
      }
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

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
  };
}
