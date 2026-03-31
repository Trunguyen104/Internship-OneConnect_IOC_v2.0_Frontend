'use client';

import { usePathname } from 'next/navigation';

import Header from '@/components/layout/Header';
import SidebarAdmin from '@/components/layout/SidebarAdmin';
import PageTitle from '@/components/ui/pagetitle';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function Admin({ children }) {
  const { headerConfig } = usePageHeader();
  const pathname = usePathname();
  const shouldScrollGlobally =
    pathname === '/admin-dashboard' || pathname.startsWith('/internship/students');

  return (
    <div className={`flex ${shouldScrollGlobally ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
      <SidebarAdmin />

      <div
        className={`flex min-w-0 flex-1 flex-col ${shouldScrollGlobally ? '' : 'overflow-hidden'}`}
      >
        <Header />
        <main
          className={`flex flex-1 flex-col bg-gray-100 p-6 2xl:px-10 ${
            shouldScrollGlobally ? '' : 'min-h-0 overflow-hidden'
          }`}
        >
          <div
            className={`mx-auto flex w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px] ${
              shouldScrollGlobally ? '' : 'min-h-0'
            }`}
          >
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
