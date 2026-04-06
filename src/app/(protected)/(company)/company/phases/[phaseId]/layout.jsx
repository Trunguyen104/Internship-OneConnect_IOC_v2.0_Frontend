'use client';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';

/**
 * PhaseWorkspaceLayout
 * Sidebar + Header layout, rendered when HR/Mentor/EntAdmin enters a specific Phase.
 * Switched to standard HTML tags to improve stability within Next.js layout trees.
 */
export default function PhaseWorkspaceLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <AppSidebar />

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex flex-1 flex-col overflow-auto bg-gray-50 p-4 2xl:p-6">
          <div className="flex w-full flex-1 flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}
