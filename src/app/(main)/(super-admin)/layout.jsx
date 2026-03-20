'use client';

import Header from '@/components/layout/Header';
import SidebarSuperAdmin from '@/components/layout/SidebarSuperAdmin';
import PageTitle from '@/components/ui/pagetitle';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function SuperAdminLayout({ children }) {
  const { headerConfig } = usePageHeader();

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarSuperAdmin />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100 p-6 2xl:px-10">
          <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]">
            {!headerConfig.hidden && headerConfig.title && (
              <PageTitle
                title={headerConfig.title}
                subtitle={headerConfig.subtitle}
                extra={headerConfig.extra}
              />
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
