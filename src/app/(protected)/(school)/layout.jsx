'use client';

import AuthGuard from '@/components/shared/AuthGuard';
import { USER_ROLE } from '@/constants/user-management/enums';

/**
 * SchoolLayout — UniAdmin only.
 * Chỉ enforce AuthGuard. Layout chrome (TopNav / Sidebar)
 * được inject tuỳ context:
 *   - Home pages        → dùng SchoolTopNav trực tiếp trong page/component
 *   - Term workspace    → layout.jsx riêng tại /school/terms/[termId]/
 */
export default function SchoolLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.SCHOOL_ADMIN]}>
      <div className="h-screen overflow-hidden bg-gray-50">{children}</div>
    </AuthGuard>
  );
}
