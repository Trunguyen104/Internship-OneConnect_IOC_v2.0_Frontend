'use client';

import AuthGuard from '@/components/shared/AuthGuard';

/**
 * ProtectedLayout — Root guard for all authenticated routes.
 * Does NOT include sidebar/header; each role's layout handles its own chrome.
 * Provides defense-in-depth: any unauthenticated user hitting any /protected/* URL
 * will be redirected to /login before reaching a role-specific guard.
 */
export default function ProtectedLayout({ children }) {
  return <AuthGuard allowedRoles={[]}>{children}</AuthGuard>;
}
