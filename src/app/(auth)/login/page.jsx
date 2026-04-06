import React, { Suspense } from 'react';

import LoginPageComponent from '@/components/features/auth/components/LoginPage';

export const metadata = {
  title: 'Login',
  description: 'System login page',
};

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center" aria-busy="true">
      <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" aria-hidden />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageComponent />
    </Suspense>
  );
}
