'use client';
import Image from 'next/image';
import { useState } from 'react';
import Input from '@/shared/components/Input';
<<<<<<< HEAD
=======
import { loginApi } from '@/services/authService';
import { useRouter } from 'next/navigation';
>>>>>>> feature/login
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
<<<<<<< HEAD
=======

  const router = useRouter();
>>>>>>> feature/login

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

<<<<<<< HEAD
<<<<<<< HEAD
    if (!form.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!form.password.trim()) {
=======
    if (!email.trim()) {
=======
    if (!form.email.trim()) {
>>>>>>> feature/login
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

<<<<<<< HEAD
    if (!password.trim()) {
>>>>>>> feature/login
=======
    if (!form.password.trim()) {
>>>>>>> feature/login
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const token = await loginApi(form);

      console.log('JWT token:', token);

      localStorage.setItem('token', token);

      router.push('/student/generalinfo');
    } catch (error) {
      setErrors({
        password: error.message,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({});
  };

  return (
    <div
      className='w-full h-screen overflow-hidden'
      style={{
        background:
          'radial-gradient(circle at top left, rgb(254, 202, 202) 0%, rgb(255, 255, 255) 65%)',
      }}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 w-full h-full'>
        {/* LEFT */}
        <div className='flex items-center justify-center px-4 lg:pr-1'>
          <div className='w-full max-w-125'>
            <Image
              src='https://iocv2.rikkei.edu.vn/logo.svg'
              alt='IOC Logo'
              width={200}
              height={60}
              className='block mx-auto mb-8'
            />

            <p className='text-center font-bold text-4xl text-black mb-4'>Đăng nhập</p>
            <p className='text-center text-gray-500 mb-8'>
              Chào mừng quay trở lại! Hãy nhập thông tin đăng nhập của bạn
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
                <label className='block mb-2 text-sm font-medium text-gray-900'>
                  Email <span className='text-red-500'>*</span>
                </label>

>>>>>>> feature/login
=======
>>>>>>> feature/login
                <div className='relative'>
                  <Input
                    label='Email'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder='name@university.edu'
<<<<<<< HEAD
<<<<<<< HEAD
                    error={errors.email}
                  />

                  <Input
                    label='Mật khẩu'
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
=======
                    className={`
                      w-full px-4 py-2 rounded-2xl
                      bg-white text-gray-900 placeholder-gray-400
                      border
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2
                      ${errors.email ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
                    `}
=======
                    error={errors.email}
>>>>>>> feature/login
                  />

                  <Input
                    label='Mật khẩu'
                    name='password'
                    type='password'
<<<<<<< HEAD
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`
                      w-full px-4 py-2 rounded-2xl
                      bg-white text-gray-900
                      border
                      ${errors.password ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2
                      ${errors.password ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
                    `}
>>>>>>> feature/login
=======
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
>>>>>>> feature/login
                  />
                </div>
              </div>

<<<<<<< HEAD
<<<<<<< HEAD
=======
              {/* REMEMBER */}
>>>>>>> feature/login
=======
>>>>>>> feature/login
              <div className='flex justify-between items-center'>
                <div className='flex justify-content-center'>
                  <input
                    id='remember'
                    type='checkbox'
<<<<<<< HEAD
<<<<<<< HEAD
                    className='w-4 h-4 rounded border-gray-300 cursor-pointer'
                  />
                  <label htmlFor='remember' className='ml-2 text-sm text-gray-900'>
                    Ghi nhớ
                  </label>
                </div>
                <Link
                  href='forgot-password'
                  className='flex text-sm hover:underline text-(--primary-700) cursor-pointer'
                >
                  Quên mật khẩu?
                </Link>
=======
                    className='w-4 h-4 rounded border-gray-300'
=======
                    className='w-4 h-4 rounded border-gray-300 cursor-pointer'
>>>>>>> feature/login
                  />
                  <label htmlFor='remember' className='ml-2 text-sm text-gray-900'>
                    Ghi nhớ
                  </label>
                </div>
                <Link
                  href='forgot-password'
                  className='flex text-sm hover:underline text-(--primary-700) cursor-pointer'
                >
                  Quên mật khẩu?
<<<<<<< HEAD
                </button>
>>>>>>> feature/login
=======
                </Link>
>>>>>>> feature/login
              </div>

              <button
                type='submit'
                className='cursor-pointer w-full h-11 rounded-xl text-white font-semibold  bg-(--color-danger) hover:bg-(--color-primary-hover)'
              >
                Đăng nhập
              </button>

              <div className='text-center text-sm text-gray-600'>
                Bạn chưa có tài khoản?{' '}
<<<<<<< HEAD
<<<<<<< HEAD
                <Link
                  href='/register'
                  className='cursor-pointer font-semibold hover:underline text-(--primary-700)'
                >
                  Đăng ký
                </Link>
=======
                <button
                  type='button'
                  onClick={() => router.push('/register')}
                  className='font-semibold hover:underline'
                  style={{ color: primaryColor }}
                >
                  Đăng ký
                </button>
>>>>>>> feature/login
=======
                <Link
                  href='/register'
                  className='cursor-pointer font-semibold hover:underline text-(--primary-700)'
                >
                  Đăng ký
                </Link>
>>>>>>> feature/login
              </div>
            </form>

            <div className='text-center text-gray-500 text-sm mt-4'>
              © 2026 Internship OneConnect
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='hidden lg:flex items-center justify-center p-8'>
          <div className='w-full max-w-175 h-full max-h-[90vh] rounded-4xl px-10 py-12 flex flex-col items-center justify-between shadow-xl bg-(--color-danger)'>
            <div className='text-center text-white'>
              <h2 className='text-4xl font-extrabold mb-4'>Internship OneConnect</h2>
              <p className='text-white/80 text-sm max-w-105 mx-auto'>
                Tham gia chương trình thực tập để học hỏi từ các chuyên gia, rèn luyện kỹ năng thực
                tế và chuẩn bị vững vàng cho sự nghiệp tương lai.
              </p>
            </div>

            <Image
              src='/assets/images/bg.png'
              alt='Mascot'
              width={400}
              height={400}
              className='object-contain rounded-xl'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
