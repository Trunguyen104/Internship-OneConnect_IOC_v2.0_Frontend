import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';

export default async function EnterpriseLayout({ children }) {
  await requireServerAuth([USER_ROLE.ENTERPRISE_ADMIN, USER_ROLE.HR, USER_ROLE.MENTOR]);
  return <>{children}</>;
}
