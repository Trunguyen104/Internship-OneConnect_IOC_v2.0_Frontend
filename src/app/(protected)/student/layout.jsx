import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';

/**
 * StudentPortalLayout — Student only.
 * Enforce server-side RBAC at layout level.
 * được đặt trực tiếp trong component hoặc page, giống như uniAdmin/entAdmin.
 */
export default async function StudentPortalLayout({ children }) {
  await requireServerAuth([USER_ROLE.STUDENT]);

  return <div className="h-screen overflow-hidden bg-gray-50">{children}</div>;
}
