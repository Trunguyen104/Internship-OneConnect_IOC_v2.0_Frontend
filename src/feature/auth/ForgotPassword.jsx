'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const primaryColor = '#c53030';
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setError('');
    setSuccess(true);

    // TODO: call API forgot password
  };

  return (
    <div
      className='w-full h-screen flex items-center justify-center'
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

        <h1 className='text-center text-black font-bold text-4xl mb-4'>Forgot Password</h1>

        <p className='text-center text-gray-500 mb-6'>
          Enter your email and we’ll send you a reset link.
        </p>

        {success ? (
          <div className='text-center'>
            <p className='text-green-600 mb-4'>Reset link has been sent to your email.</p>

            <button
              onClick={() => router.push('/login')}
              className='font-semibold hover:underline'
              style={{ color: primaryColor }}
            >
              Back to Login
            </button>
          </div>
        ) : (
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
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    focus:outline-none focus:ring-2
                    ${error ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
                  `}
                />

                {error && (
                  <span
                    className='absolute right-3 top-1/2 -translate-y-1/2
                    text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md'
                  >
                    {error}
                  </span>
                )}
              </div>
            </div>

            <button
              type='submit'
              className='w-full h-11 rounded-xl text-white font-semibold'
              style={{ backgroundColor: primaryColor }}
            >
              Send Reset Link
            </button>

            <div className='text-center text-sm'>
              <button
                type='button'
                onClick={() => router.push('/login')}
                className='hover:underline font-medium'
                style={{ color: primaryColor }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
