'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/components/features/auth/services/authService';
import { setAccessToken } from '@/components/features/auth/services/authStorage';
import { useToast } from '@/providers/ToastProvider';
import { AUTH_MESSAGES } from '@/constants/auth/uiText';
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
      const token = await login(form);

      if (form.rememberMe) {
        localStorage.setItem('rememberEmail', form.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      setAccessToken(token);

      toast.success(AUTH_MESSAGES.TOAST.LOGIN_SUCCESS);
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

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
  };
}
