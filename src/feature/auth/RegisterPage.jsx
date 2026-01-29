'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const primaryColor = '#c53030';
  const router = useRouter();

  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (role === 'student' && !form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (role === 'enterprise' && !form.companyName.trim())
      newErrors.companyName = 'Company name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

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
        {/* LEFT */}
        <div className='flex items-center justify-center px-4 lg:pr-1'>
          <div className='w-full max-w-125'>
            <Image
              src='https://iocv2.rikkei.edu.vn/logo.svg'
              alt='IOC Logo'
              width={180}
              height={45}
              className='block mx-auto mb-6'
            />

            <p className='text-center font-bold text-3xl text-black mb-5'>REGISTER</p>

            <p className='text-center text-gray-500 mb-4'>Create your account to get started.</p>

            {/* ROLE */}
            <div className='flex justify-center gap-4 mb-6'>
              {['student', 'enterprise'].map((r) => (
                <button
                  key={r}
                  type='button'
                  onClick={() => setRole(r)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium ${
                    role === r ? 'text-white' : 'text-gray-600 border-gray-300'
                  }`}
                  style={role === r ? { backgroundColor: primaryColor } : {}}
                >
                  {r === 'student' ? 'Student' : 'Enterprise'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {role === 'student' && (
                <Input
                  label='Full Name'
                  name='fullName'
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  className={'text-gray-900'}
                />
              )}

              {role === 'enterprise' && (
                <Input
                  label='Company Name'
                  name='companyName'
                  value={form.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                />
              )}

              <Input
                label='Email'
                name='email'
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label='Password'
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                label='Confirm Password'
                type='password'
                name='confirmPassword'
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <button
                type='submit'
                className='w-full h-11 rounded-xl text-white font-semibold mt-4'
                style={{ backgroundColor: primaryColor }}
              >
                Create Account
              </button>

              <div className='mt-4 text-center text-sm text-gray-600'>
                Already have an account?{' '}
                <button
                  type='button'
                  onClick={() => router.push('/login')}
                  className='font-semibold hover:underline'
                  style={{ color: primaryColor }}
                >
                  Login
                </button>
              </div>
            </form>

            <div className='text-center text-gray-500 text-sm mt-4'>
              © 2025 Internship OneConnect
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='hidden lg:flex items-center justify-center p-8'>
          <div
            className='w-full max-w-175 h-full max-h-[90vh] rounded-4xl px-10 py-12 flex flex-col items-center justify-between shadow-xl'
            style={{ backgroundColor: primaryColor }}
          >
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

/* INPUT */
function Input({ label, error, ...props }) {
  return (
    <div className='mb-4'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>
        {label} <span className='text-red-500'>*</span>
      </label>

      <div className='relative'>
        <input
          {...props}
          className={`
            w-full px-4 py-2 rounded-xl
            bg-white
            text-gray-900
            placeholder-gray-400
            border
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2
            ${error ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
          `}
        />

        {/* ERROR INLINE */}
        {error && (
          <span
            className='
              absolute right-3 top-1/2 -translate-y-1/2
              text-xs text-red-600
              bg-red-50 px-2 py-0.5 rounded-md
            '
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
