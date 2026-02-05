'use client';

import Image from 'next/image';
import { useState } from 'react';
import Input from '@/shared/components/Input';
import Link from 'next/link';

export default function RegisterPage() {
<<<<<<< HEAD
  const [role, setRole] = useState('student');

  const getInitialForm = (role) => ({
=======
  const primaryColor = '#c53030';
  const router = useRouter();

  const [role, setRole] = useState('sinh viên');
  const [form, setForm] = useState({
>>>>>>> feature/login
    email: '',
    password: '',
    confirmPassword: '',
    fullName: role === 'student' ? '' : '',
    companyName: role === 'enterprise' ? '' : '',
  });

  const [form, setForm] = useState(getInitialForm('student'));

  const [errors, setErrors] = useState({});

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

    if (role === 'student' && !form.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (role === 'enterprise' && !form.companyName.trim()) {
      newErrors.companyName = 'Tên doanh nghiệp là bắt buộc';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!form.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Register:', { role, ...form });
    }
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
        <div className='flex items-center justify-center px-4 lg:pr-1'>
          <div className='w-full max-w-125'>
            <Image
              src='https://iocv2.rikkei.edu.vn/logo.svg'
              alt='IOC Logo'
              width={180}
              height={45}
              className='block mx-auto mb-4 mt-2'
            />

            <p className='text-center font-bold text-3xl text-black mb-2.5'>Đăng ký</p>
<<<<<<< HEAD
            <p className='text-center text-gray-500 mb-4'>Tạo tài khoản của bạn để bắt đầu.</p>

            <div className='flex gap-4 mb-5'>
              {[
                { value: 'student', label: 'Sinh viên' },
                { value: 'enterprise', label: 'Doanh nghiệp' },
              ].map((r) => (
=======

            <p className='text-center text-gray-500 mb-4'>Tạo tài khoản của bạn để bắt đầu.</p>

            {/* ROLE */}
            <div className='flex gap-4 mb-5'>
              {['sinh viên', 'doanh nghiệp'].map((r) => (
>>>>>>> feature/login
                <button
                  key={r.value}
                  type='button'
                  onClick={() => {
                    setRole(r.value);
                    setForm(getInitialForm(r.value));
                    setErrors({});
                  }}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium cursor-pointer ${
                    role === r.value ? 'text-white' : 'text-gray-600 border-gray-300'
                  }`}
                  style={role === r.value ? { backgroundColor: 'var(--color-danger)' } : {}}
                >
<<<<<<< HEAD
                  {r.label}
=======
                  {r === 'sinh viên' ? 'Sinh viên' : 'Doanh nghiệp'}
>>>>>>> feature/login
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {role === 'sinh viên' && (
                <Input
                  label='Họ và tên'
                  name='fullName'
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
              )}

              {role === 'doanh nghiệp' && (
                <Input
                  label='Tên doanh nghiệp'
                  name='companyName'
                  value={form.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                />
              )}

              <Input
                label='Email'
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label='Mật khẩu'
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                label='Xác nhận mật khẩu'
                type='password'
                name='confirmPassword'
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <button
                type='submit'
<<<<<<< HEAD
                className='w-full h-11 rounded-xl text-white font-semibold mt-3 bg-(--color-danger) hover:bg-(--color-primary-hover) cursor-pointer'
=======
                className='w-full h-11 rounded-xl text-white font-semibold mt-3'
                style={{ backgroundColor: primaryColor }}
>>>>>>> feature/login
              >
                Tạo tài khoản
              </button>

              <div className='mt-4 text-center text-sm text-gray-600'>
                Bạn đã có tài khoản?{' '}
<<<<<<< HEAD
                <Link
                  href='/login'
                  className='font-semibold hover:underline text-(--primary-700) cursor-pointer'
                >
                  Đăng nhập
                </Link>
=======
                <button
                  type='button'
                  onClick={() => router.push('/login')}
                  className='font-semibold hover:underline'
                  style={{ color: primaryColor }}
                >
                  Đăng nhập
                </button>
>>>>>>> feature/login
              </div>
            </form>

            <div className='text-center text-gray-500 text-sm mt-4'>
              © 2026 Internship OneConnect
            </div>
          </div>
        </div>

        <div className='hidden lg:flex items-center justify-center p-8'>
          <div className='w-full max-w-175 h-full max-h-[90vh] rounded-4xl px-10 py-12 flex flex-col items-center justify-between shadow-xl bg-(--color-danger)'>
            <div className='text-center text-white'>
              <h2 className='text-4xl font-extrabold mb-4'>Internship OneConnect</h2>
              <p className='text-white/80 text-sm max-w-105 mx-auto'>
                Join an internship program to learn from experts, hone practical skills.
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
