import ForgotPasswordPage from '@/components/features/auth/components/ForgotPassword';
import React from 'react';

export const metadata = {
  title: 'Forgot Password',
  description: 'System login page',
};

export default function page() {
  return (
    <>
      <ForgotPasswordPage />
    </>
  );
}
