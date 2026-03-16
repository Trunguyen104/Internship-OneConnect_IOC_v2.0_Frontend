'use client';

import React from 'react';
import Image from 'next/image';

import { AUTH_UI } from '@/constants/auth/uiText';

export default function LoginHeader() {
  return (
    <>
      <Image
        src='/assets/images/logo.svg'
        alt={AUTH_UI.LABELS.LOGO}
        width={200}
        height={60}
        className='mx-auto mb-8 block'
      />
      <h1 className='mb-4 text-center text-4xl font-bold text-black'>{AUTH_UI.LOGIN.TITLE}</h1>
      <p className='mb-8 text-center text-gray-500'>{AUTH_UI.LOGIN.WELCOME}</p>
    </>
  );
}
