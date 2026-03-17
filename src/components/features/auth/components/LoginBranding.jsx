'use client';

import React from 'react';
import Image from 'next/image';

import { AUTH_UI } from '@/constants/auth/uiText';

export default function LoginBranding() {
  return (
    <div className='hidden items-center justify-center p-8 lg:flex'>
      <div className='flex h-full max-h-[90vh] w-full max-w-175 flex-col items-center justify-between rounded-4xl bg-(--color-danger) px-10 py-12 shadow-xl'>
        <div className='text-center text-white'>
          <h2 className='mb-4 text-4xl font-extrabold'>{AUTH_UI.BRANDING.TITLE}</h2>
          <p className='mx-auto max-w-105 text-sm text-white/80'>{AUTH_UI.BRANDING.DESCRIPTION}</p>
        </div>

        <Image
          src='/assets/images/bg.png'
          alt={AUTH_UI.LABELS.MASCOT}
          width={400}
          height={400}
          className='rounded-xl object-contain'
        />
      </div>
    </div>
  );
}
