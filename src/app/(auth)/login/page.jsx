import LoginPage from '@/components/features/auth/components/LoginPage';
import React from 'react';

export const metadata = {
  title: 'Login',
  description: 'System login page',
};

export default function page() {
  return (
    <>
      <LoginPage />
    </>
  );
}
