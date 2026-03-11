import ForgotPasswordPage from '@/components/features/auth/components/ForgotPassword';
import React from 'react';

export const metadata = {
  title: 'Quên mật khẩu',
  description: 'Trang đăng nhập hệ thống',
};

export default function page() {
  return (
    <>
      <ForgotPasswordPage />
    </>
  );
}

