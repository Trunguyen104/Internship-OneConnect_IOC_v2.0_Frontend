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
      className={`sticky top-0 hidden h-screen w-64 flex-col border-r border-gray-100 bg-white/80 backdrop-blur-xl md:flex ${className}`}
    >
      <div className="flex flex-col items-center px-8 py-6">
        <Image
          src="/assets/images/logo.svg"
          alt="IOC Logo"
          width={120}
          height={42}
          className="transition-transform hover:scale-105"
        />
      </div>

      <div className="mt-2 flex flex-1 flex-col px-4">
        {backButton && (
          <Link
            href={backButton.href}
            className={`group mx-2 mb-4 flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 text-sm font-black transition-all hover:bg-white hover:shadow-sm ${
              backButton.className || 'text-primary'
            }`}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm transition-transform group-hover:-translate-x-1">
              {backButton.icon || <ArrowLeftOutlined className="text-[10px]" />}
            </div>
            {backButton.label}
          </Link>
        )}

        <nav className="space-y-1">
          {menus.map((item) => {
            const isActive = isItemActive(item.href);

            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={`group relative flex items-center gap-4 rounded-xl px-4 py-2.5 text-sm font-black tracking-tight transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.01]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>

                  {isActive && (
                    <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/80 shadow-sm" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 text-center">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Portal v2.0</p>
      </div>
    </aside>
  );
}
