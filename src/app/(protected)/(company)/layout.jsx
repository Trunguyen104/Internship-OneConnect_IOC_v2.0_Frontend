'use client';

import AuthGuard from '@/components/shared/AuthGuard';
import { USER_ROLE } from '@/constants/user-management/enums';

/**
 * CompanyLayout — EntAdmin, HR, Mentor.
 * Chỉ enforce AuthGuard. Layout chrome (TopNav / Sidebar)
 * được inject tuỳ context:
 *   - Home pages         → dùng CompanyTopNav trực tiếp trong page/component
 *   - Phase workspace    → layout.jsx riêng tại /company/phases/[phaseId]/
 */
export default function CompanyLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.ENTERPRISE_ADMIN, USER_ROLE.HR, USER_ROLE.MENTOR]}>
      <div className="h-screen overflow-hidden bg-gray-50">{children}</div>
    </AuthGuard>
  );
}
