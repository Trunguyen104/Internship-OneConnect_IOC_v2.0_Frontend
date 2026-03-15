'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/components/features/auth/services/authService';
import { setAccessToken } from '@/components/features/auth/services/authStorage';
import { useToast } from '@/providers/ToastProvider';

export function useLogin() {
  const toast = useToast();
  const router = useRouter();

  // const [form, setForm] = useState({
  //   email: '',
  //   password: '',
  //   rememberMe: false,
  // });
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('rememberEmail');
      const savedPassword = localStorage.getItem('rememberPassword');

      if (savedEmail && savedPassword) {
        return {
          email: savedEmail,
          password: savedPassword,
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

  // useEffect(() => {
  //   const savedEmail = localStorage.getItem('rememberEmail');
  //   const savedPassword = localStorage.getItem('rememberPassword');

  //   if (savedEmail && savedPassword) {
  //     setForm({
  //       email: savedEmail,
  //       password: savedPassword,
  //       rememberMe: true,
  //     });
  //   }
  // }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.email, form.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = await login(form);

      if (form.rememberMe) {
        localStorage.setItem('rememberEmail', form.email);
        localStorage.setItem('rememberPassword', form.password);
      } else {
        localStorage.removeItem('rememberEmail');
        localStorage.removeItem('rememberPassword');
      }

      setAccessToken(token, form.rememberMe);

      toast.success('Đăng nhập thành công');
      router.push('/internship-groups');
    } catch (err) {
      setErrors({ password: err.message });
      toast.error('Đăng nhập thất bại');
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
