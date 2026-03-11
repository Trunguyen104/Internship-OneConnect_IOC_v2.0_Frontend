'use client';

import React from 'react';
import Image from 'next/image';

export default function LoginBranding() {
  return (
    <div className='hidden items-center justify-center p-8 lg:flex'>
      <div className='flex h-full max-h-[90vh] w-full max-w-175 flex-col items-center justify-between rounded-4xl bg-(--color-danger) px-10 py-12 shadow-xl'>
        <div className='text-center text-white'>
          <h2 className='mb-4 text-4xl font-extrabold'>Internship OneConnect</h2>
          <p className='mx-auto max-w-105 text-sm text-white/80'>
            Tham gia chương trình thực tập để học hỏi từ các chuyên gia, rèn luyện kỹ năng thực tế
            và chuẩn bị vững vàng cho sự nghiệp tương lai.
          </p>
        </div>

        <Image
          src='/assets/images/bg.png'
          alt='Mascot'
          width={400}
          height={400}
          className='rounded-xl object-contain'
        />
      </div>
    </div>
  );
}
