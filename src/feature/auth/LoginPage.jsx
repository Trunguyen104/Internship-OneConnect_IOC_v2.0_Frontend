'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const primaryColor = '#c53030';
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Login success:', { email, password });
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
              width={200}
              height={60}
              className='block mx-auto mb-8'
            />

            <p className='text-center font-bold text-5xl text-black mb-6'>LOGIN</p>
            <p className='text-center text-gray-500 mb-6'>Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* EMAIL */}
              <div>
                <label className='block mb-2 text-sm font-medium text-gray-900'>
                  Email address <span className='text-red-500'>*</span>
                </label>

                <div className='relative'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='name@university.edu'
                    className={`
                      w-full px-4 py-2 rounded-xl
                      bg-white text-gray-900 placeholder-gray-400
                      border
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2
                      ${errors.email ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
                    `}
                  />

                  {errors.email && (
                    <span
                      className='absolute right-3 top-1/2 -translate-y-1/2
                      text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md'
                    >
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className='flex justify-between mb-2'>
                  <label className='text-sm font-medium text-gray-900'>
                    Password <span className='text-red-500'>*</span>
                  </label>

                  <button
                    type='button'
                    onClick={() => router.push('/forgot-password')}
                    className='text-sm hover:underline'
                    style={{ color: primaryColor }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className='relative'>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`
                      w-full px-4 py-2 rounded-xl
                      bg-white text-gray-900
                      border
                      ${errors.password ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2
                      ${errors.password ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
                    `}
                  />

                  {errors.password && (
                    <span
                      className='absolute right-3 top-1/2 -translate-y-1/2
                      text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md'
                    >
                      {errors.password}
                    </span>
                  )}
                </div>
              </div>

              {/* REMEMBER */}
              <div className='flex items-center'>
                <input id='remember' type='checkbox' className='w-4 h-4 rounded border-gray-300' />
                <label htmlFor='remember' className='ml-2 text-sm text-gray-900'>
                  Remember this device
                </label>
              </div>

              {/* BUTTON */}
              <button
                type='submit'
                className='w-full h-11 rounded-xl text-white font-semibold'
                style={{ backgroundColor: primaryColor }}
              >
                Sign In
              </button>

              <div className='text-center text-sm text-gray-600'>
                Don’t have an account?{' '}
                <button
                  type='button'
                  onClick={() => router.push('/register')}
                  className='font-semibold hover:underline'
                  style={{ color: primaryColor }}
                >
                  Register
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
            className='w-full max-w-175 h-full max-h-[90vh]
              rounded-4xl px-10 py-12
              flex flex-col items-center justify-between
              shadow-xl'
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
