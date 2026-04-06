import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';

/**
 * SchoolLayout — UniAdmin only.
 * Enforce server-side RBAC at layout level.
 * được inject tuỳ context:
 *   - Home pages        → dùng SchoolTopNav trực tiếp trong page/component
 *   - Term workspace    → layout.jsx riêng tại /school/terms/[termId]/
 */
export default async function SchoolLayout({ children }) {
  await requireServerAuth([USER_ROLE.SCHOOL_ADMIN]);

  return <div className="h-screen overflow-hidden bg-gray-50">{children}</div>;
}
