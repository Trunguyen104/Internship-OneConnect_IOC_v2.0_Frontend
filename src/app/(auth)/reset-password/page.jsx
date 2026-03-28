import React from 'react';

import ResetPasswordPage from '@/components/features/auth/components/ResetPassword';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset your system password',
};

export default async function page({ searchParams }) {
  const params = await searchParams;
  const token = params?.token || '';

  return (
    <>
      <ResetPasswordPage token={token} />
    </>
  );
}
