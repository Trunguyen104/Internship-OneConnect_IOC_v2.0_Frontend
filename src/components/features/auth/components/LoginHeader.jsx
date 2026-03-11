'use client';

import React from 'react';
import Image from 'next/image';

export default function LoginHeader() {
  return (
    <>
      <Image
        src='/assets/images/logo.svg'
        alt='IOC Logo'
        width={200}
        height={60}
        className='mx-auto mb-8 block'
      />
      <h1 className='mb-4 text-center text-4xl font-bold text-black'>Đăng nhập</h1>
      <p className='mb-8 text-center text-gray-500'>
        Chào mừng quay trở lại! Hãy nhập thông tin đăng nhập của bạn
      </p>
    </>
  );
}

