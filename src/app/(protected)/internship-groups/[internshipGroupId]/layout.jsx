import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';

const ALLOWED_ROLES = [USER_ROLE.STUDENT, USER_ROLE.HR, USER_ROLE.MENTOR];

/**
 * Internship group workspace layout.
 * Replaced Ant Design Layout with standard HTML to avoid runtime errors in Server Components.
 * Layout structure: Flex container with pinned Sidebar, then Flex Column for Header + Main Content.
 */
export default async function InternshipGroupLayout({ children }) {
  await requireServerAuth(ALLOWED_ROLES);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Sidebar - pins to the left */}
      <AppSidebar />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Main Header - pins to the top of the content area */}
        <Header />

        {/* Scrollable Main Content area */}
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-4 2xl:p-6">
          <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
