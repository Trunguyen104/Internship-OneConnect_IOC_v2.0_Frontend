'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Input from '@/components/ui/Input';

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

    // ✅ xoá TẤT CẢ lỗi khi nhập lại (giống Login / Register)
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
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
          'radial-gradient(circle at top left, rgb(254, 202, 202) 0%, rgb(255, 255, 255) 65%)',
      }}
    >
      <div className='w-full max-w-105 px-6'>
        <Image
          src='https://iocv2.rikkei.edu.vn/logo.svg'
          alt='IOC Logo'
          width={180}
          height={45}
          className='mx-auto mb-6'
        />

        <h1 className='mb-4 text-center text-4xl font-bold text-black'>Quên mật khẩu</h1>
        <p className='mb-6 text-center text-gray-500'>Nhập email xác thực của bạn</p>

        {success ? (
          <div className='text-center'>
            <p className='mb-4 text-green-600'>Đã gửi link đặt lại mật khẩu</p>

            <Link href='/login' className='font-semibold text-(--primary-700) hover:underline'>
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label='Email'
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder='name@university.edu'
              error={errors.email}
            />

            <button
              type='submit'
              className='mt-2 h-11 w-full cursor-pointer rounded-xl bg-(--color-primary) font-semibold text-white hover:bg-(--color-primary-hover)'
            >
              Gửi yêu cầu đặt lại
            </button>

            <div className='mt-4 text-center text-sm'>
              <Link href='/login' className='font-medium text-(--primary-700) hover:underline'>
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
