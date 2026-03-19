'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Input from '@/components/ui/input';

import { AUTH_UI, AUTH_MESSAGES } from '@/constants/auth/uiText';

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = AUTH_MESSAGES.VALIDATION.EMAIL_INVALID;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setSuccess(true);
    }
  };

  return (
    <div
      className='flex h-screen w-full items-center justify-center'
      style={{
        background:
          'radial-gradient(circle at top left, var(--primary-100) 0%, var(--color-surface) 65%)',
      }}
    >
      <div className='w-full max-w-105 px-6'>
        <Image
          src='/assets/images/logo.svg'
          alt={AUTH_UI.LABELS.LOGO}
          width={180}
          height={45}
          className='mx-auto mb-6'
        />

        <h1 className='mb-4 text-center text-4xl font-bold text-black'>
          {AUTH_UI.FORGOT_PASSWORD.TITLE}
        </h1>
        <p className='mb-6 text-center text-gray-500'>{AUTH_UI.FORGOT_PASSWORD.DESC}</p>

        {success ? (
          <div className='text-center'>
            <p className='text-success mb-4'>{AUTH_UI.FORGOT_PASSWORD.SUCCESS_TEXT}</p>

            <Link href='/login' className='font-semibold text-(--primary-700) hover:underline'>
              {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label={AUTH_UI.LABELS.EMAIL}
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder={AUTH_UI.LABELS.EMAIL_PLACEHOLDER}
              error={errors.email}
            />

            <button
              type='submit'
              className='mt-2 h-11 w-full cursor-pointer rounded-xl bg-(--color-primary) font-semibold text-white hover:bg-(--color-primary-hover)'
            >
              {AUTH_UI.FORGOT_PASSWORD.BUTTON}
            </button>

            <div className='mt-4 text-center text-sm'>
              <Link href='/login' className='font-medium text-(--primary-700) hover:underline'>
                {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
