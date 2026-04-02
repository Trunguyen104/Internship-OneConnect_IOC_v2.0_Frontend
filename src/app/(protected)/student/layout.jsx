'use client';

import AuthGuard from '@/components/shared/AuthGuard';
import { USER_ROLE } from '@/constants/user-management/enums';

/**
 * StudentPortalLayout — Student only.
 * Chỉ enforce AuthGuard. Layout chrome (TopNav)
 * được đặt trực tiếp trong component hoặc page, giống như uniAdmin/entAdmin.
 */
export default function StudentPortalLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.STUDENT]}>
      <div className="h-screen overflow-hidden bg-gray-50">{children}</div>
    </AuthGuard>
  );
}
