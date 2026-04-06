import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';

/**
 * AdminLayout — SuperAdmin.
 * Pattern: AppSidebar (role-based menu) + Header + Content.
 * Using standard HTML tags instead of AntD Layout/Content to ensure RSC compatibility.
 */
export default async function AdminLayout({ children }) {
  await requireServerAuth([USER_ROLE.SUPER_ADMIN]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex flex-1 flex-col overflow-hidden bg-gray-50 p-4 2xl:p-6">
          <div className="flex w-full flex-1 flex-col overflow-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}
