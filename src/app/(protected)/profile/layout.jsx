import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { requireServerAuth } from '@/lib/server/auth-session';

/**
 * ProfileLayout — accessible to all authenticated users (any role).
 * This layout uses standard HTML elements to avoid 'Element type is invalid' errors
 * associated with using Ant Design components in async React Server Components.
 */
export default async function ProfileLayout({ children }) {
  await requireServerAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Sidebar - Note: AppSidebar must be a Client Component if it uses hooks */}
      <AppSidebar />

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* Main Header */}
        <Header />

        {/* Dynamic Content Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-gray-50 p-4 2xl:p-6">
          <div className="flex w-full flex-1 flex-col overflow-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}
