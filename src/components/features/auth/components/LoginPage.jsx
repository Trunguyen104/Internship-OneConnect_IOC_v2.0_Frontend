'use client';

import React from 'react';

import { useLogin } from '../hooks/useLogin';
import LoginBranding from './LoginBranding';
import LoginForm from './LoginForm';
import LoginHeader from './LoginHeader';

/**
 * LoginPage
 * Main entry point for the authentication flow.
 * Uses a modular architecture with specialized sub-components for better maintainability.
 */
export default function LoginPage() {
  const { form, errors, handleChange, handleSubmit } = useLogin();

  return (
    <div
      className="h-screen w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at top left, var(--primary-100) 0%, var(--color-surface) 65%)',
      }}
    >
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL: AUTH FORM */}
        <div className="animate-in fade-in slide-in-from-left-4 flex items-center justify-center px-4 duration-700 lg:pr-1">
          <div className="w-full max-w-125">
            <LoginHeader />
            <LoginForm
              form={form}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* RIGHT PANEL: BRANDING / MASCOT */}
        <div className="animate-in fade-in slide-in-from-right-4 hidden h-full items-center justify-center p-8 duration-1000 lg:flex">
          <LoginBranding />
        </div>
      </div>
    </div>
  );
}
