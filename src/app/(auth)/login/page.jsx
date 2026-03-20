import React from 'react';

import LoginPage from '@/components/features/auth/components/LoginPage';

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
