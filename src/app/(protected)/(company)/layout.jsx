import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';

/**
 * CompanyLayout — EntAdmin, HR, Mentor.
 * Enforce server-side RBAC at layout level.
 * được inject tuỳ context:
 *   - Home pages         → dùng CompanyTopNav trực tiếp trong page/component
 *   - Phase workspace    → layout.jsx riêng tại /company/phases/[phaseId]/
 */
export default async function CompanyLayout({ children }) {
  await requireServerAuth([USER_ROLE.ENTERPRISE_ADMIN, USER_ROLE.HR, USER_ROLE.MENTOR]);

  return <div className="h-screen overflow-hidden bg-gray-50">{children}</div>;
}
