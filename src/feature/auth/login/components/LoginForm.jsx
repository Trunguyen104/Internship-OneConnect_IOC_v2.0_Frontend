'use client';

import React from 'react';
import Link from 'next/link';
import Input from '@/shared/components/Input';

export default function LoginForm({ form, errors, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div className='space-y-4'>
        <Input
          label='Email'
          name='email'
          type='email'
          value={form.email}
          onChange={onChange}
          placeholder='name@university.edu'
          error={errors.email}
        />

        <Input
          label='Mật khẩu'
          name='password'
          type='password'
          value={form.password}
          onChange={onChange}
          error={errors.password}
        />
      </div>

      <div className='flex items-center justify-between'>
        <label className='flex cursor-pointer items-center gap-2 text-sm select-none'>
          <input
            type='checkbox'
            name='rememberMe'
            checked={form.rememberMe}
            onChange={onChange}
            className='h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)'
          />
          Ghi nhớ đăng nhập
        </label>
        <Link
          href='/forgot-password'
          className='text-sm font-medium text-(--primary-700) hover:underline'
        >
          Quên mật khẩu?
        </Link>
      </div>

      <button
        type='submit'
        className='flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-(--color-primary) font-semibold text-white transition-all hover:bg-(--color-primary-hover) active:scale-[0.98]'
      >
        Đăng nhập
      </button>

      <div className='mt-6 text-center text-xs text-gray-400'>© 2026 Internship OneConnect</div>
    </form>
  );
}
