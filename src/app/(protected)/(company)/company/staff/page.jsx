import UserManagementPage from '@/components/features/user-management/UserManagementPage';
import CompanyTopNav from '@/components/layout/CompanyTopNav';
import { UI_TEXT } from '@/lib/UI_Text';

export const metadata = { title: 'Staff | Company' };

export default function CompanyStaffPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <UserManagementPage title={UI_TEXT.USER_MANAGEMENT.STAFF_TITLE} />
      </main>
    </div>
  );
}
