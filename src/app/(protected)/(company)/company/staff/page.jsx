import UserManagementPage from '@/components/features/user-management/UserManagementPage';
import CompanyTopNav from '@/components/layout/CompanyTopNav';
import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';
import { UI_TEXT } from '@/lib/UI_Text';

export const metadata = { title: 'Staff | Company' };

export default async function CompanyStaffPage() {
  await requireServerAuth([USER_ROLE.ENTERPRISE_ADMIN, USER_ROLE.HR, USER_ROLE.MENTOR]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <UserManagementPage
          title={UI_TEXT.USER_MANAGEMENT.STAFF_TITLE}
          subtitle={UI_TEXT.USER_MANAGEMENT.SUBTITLE}
          filterVariant="enterpriseStaff"
        />
      </main>
    </div>
  );
}
