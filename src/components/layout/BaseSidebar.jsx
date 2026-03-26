'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLayoutStore } from '@/store/useLayoutStore';

export default function BaseSidebar({
  menus = [],
  backButton,
  activeStrategy = 'prefix',
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
      className={`sticky top-0 hidden h-screen flex-col border-r border-gray-100 bg-white/80 transition-all duration-300 ease-in-out backdrop-blur-xl md:flex ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      <div
        className={`flex flex-col items-center transition-all duration-300 ${isSidebarCollapsed ? 'py-0 h-4' : 'py-6 px-8'}`}
      >
        {!isSidebarCollapsed && (
          <div className="relative flex h-10 w-32 items-center justify-center overflow-hidden transition-all duration-300">
            <Image
              src="/assets/images/logo.svg"
              alt="IOC Logo"
              fill
              className="object-contain transition-all duration-300 hover:scale-110"
              priority
            />
          </div>
        )}
      </div>

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarCollapsed ? 'mt-0 px-2' : 'mt-2 px-4'}`}
      >
        {backButton && (
          <Link
            href={backButton.href}
            className={`group mx-2 mb-4 flex items-center rounded-xl bg-gray-50/50 p-3 text-sm font-black transition-all hover:bg-white hover:shadow-sm ${
              isSidebarCollapsed ? 'justify-center px-0' : 'gap-3'
            } ${backButton.className || 'text-primary'}`}
            title={isSidebarCollapsed ? backButton.label : ''}
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm transition-transform group-hover:-translate-x-1">
              {backButton.icon || <ArrowLeftOutlined className="text-[10px]" />}
            </div>
            {!isSidebarCollapsed && <span className="">{backButton.label}</span>}
          </Link>
        )}

        <nav className="space-y-1">
          {menus.map((item) => {
            const isActive = isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block transition-all duration-300 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <div
                  className={`group relative flex items-center rounded-xl py-2.5 text-sm font-black tracking-tight transition-all duration-300 ${
                    isSidebarCollapsed ? 'justify-center px-0' : 'gap-4 px-4'
                  } ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.01]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={`text-lg transition-transform duration-300 flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                  >
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && <span className="flex-1">{item.label}</span>}

                  {isActive && !isSidebarCollapsed && (
                    <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/80 shadow-sm" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 text-center">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          {isSidebarCollapsed ? 'v2' : 'Portal v2.0'}
        </p>
      </div>
    </aside>
  );
}
