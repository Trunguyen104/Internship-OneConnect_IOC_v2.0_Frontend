'use client';

import Header from '@/components/layout/Header';
import SidebarAdmin from '@/components/layout/SidebarAdmin';
import PageTitle from '@/components/ui/PageTitle';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function Admin({ children }) {
  const { headerConfig } = usePageHeader();

  return (
    <div className='flex h-screen overflow-hidden'>
      <SidebarAdmin />

      <div className='flex h-screen min-w-0 flex-1 flex-col overflow-hidden'>
        <Header />
        <main className='flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100 p-6 2xl:px-10'>
          <div className='mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]'>
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
