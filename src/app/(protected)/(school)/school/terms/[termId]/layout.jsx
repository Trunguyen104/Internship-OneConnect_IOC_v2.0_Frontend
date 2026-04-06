'use client';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';

/**
 * TermWorkspaceLayout
 * Sidebar + Header layout, rendered when a UniAdmin enters a specific Term.
 * Using standard HTML elements to maintain consistency and prevent potential runtime errors
 * in mixed Server/Client component trees within Next.js layouts.
 */
export default function TermWorkspaceLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
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
