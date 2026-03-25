'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLayoutStore } from '@/store/useLayoutStore';

export default function BaseSidebar({
  menus = [],
  backButton,
  activeStrategy = 'exact',
  className = '',
}) {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useLayoutStore();

  const isItemActive = (href) => {
    if (activeStrategy === 'prefix') {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen flex-col border-r border-slate-200 bg-gray-50 transition-all duration-300 ease-in-out md:flex ${
        isSidebarCollapsed ? 'w-20' : 'w-[15.1rem]'
      } ${className}`}
    >
      <div
        className={`flex justify-center px-4 py-6 transition-all duration-300 ${
          isSidebarCollapsed ? 'opacity-0 h-0 py-0 overflow-hidden' : 'px-14 opacity-100'
        }`}
      >
        {!isSidebarCollapsed && (
          <Image src="/assets/images/logo.svg" alt="IOC Logo" width={120} height={40} />
        )}
      </div>

      <div className="flex flex-1 flex-col transition-all duration-300">
        {backButton && (
          <Link
            href={backButton.href}
            className={`mx-auto mb-6 flex cursor-pointer items-center gap-2 text-[14px] font-bold transition-all ${
              isSidebarCollapsed ? 'px-0 justify-center' : 'mx-5'
            } ${backButton.className || 'text-primary hover:text-primary-hover'}`}
          >
            <span className="text-lg">{backButton.icon || <ArrowLeftOutlined />}</span>
            {!isSidebarCollapsed && backButton.label}
          </Link>
        )}

        <nav className={`flex-1 space-y-1 ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
          {menus.map((item) => {
            const isActive = isItemActive(item.href);

            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={`flex items-center rounded-xl py-2 text-sm font-semibold transition-all ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'
                  } ${
                    isActive ? 'bg-primary-surface text-primary' : 'text-slate-600 hover:bg-blue-50'
                  }`}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <span className="text-xl leading-none flex items-center justify-center">
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && <span className="truncate flex-1">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
