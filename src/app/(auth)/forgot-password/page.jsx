import React from 'react';

import ForgotPasswordPage from '@/components/features/auth/components/ForgotPassword';

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
