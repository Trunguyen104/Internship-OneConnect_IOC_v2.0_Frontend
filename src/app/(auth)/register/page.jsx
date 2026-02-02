import RegisterPage from '@/feature/auth/RegisterPage';
import React from 'react';

export const metadata = {
  title: 'Đăng ký',
  description: 'Trang đăng ký tài khoản',
};

export default function page() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
