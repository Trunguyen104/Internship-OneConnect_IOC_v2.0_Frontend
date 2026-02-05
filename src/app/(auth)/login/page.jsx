import LoginPage from '@/feature/auth/LoginPage';
import React from 'react';

export const metadata = {
  title: 'Đăng nhập',
  description: 'Trang đăng nhập hệ thống',
};

export default function page() {
  return (
    <>
      <LoginPage />
    </>
  );
}
