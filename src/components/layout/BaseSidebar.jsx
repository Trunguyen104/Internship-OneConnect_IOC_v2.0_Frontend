'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function BaseSidebar({
  menus = [],
  backButton,
  activeStrategy = 'exact',
  className = '',
}) {
  const pathname = usePathname();

  const isItemActive = (href) => {
    if (activeStrategy === 'prefix') {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen w-[15.1rem] flex-col border-r border-slate-200 bg-gray-50 md:flex ${className}`}
    >
      <div className='flex justify-center px-14 py-6'>
        <Image src='/assets/images/logo.svg' alt='IOC Logo' width={120} height={40} />
      </div>

      {backButton && (
        <Link
          href={backButton.href}
          className={`mx-5 mb-6 flex cursor-pointer items-center gap-2 text-[14px] font-bold transition-colors ${
            backButton.className || 'text-primary hover:text-primary-hover'
          }`}
        >
          {backButton.icon || <ArrowLeftOutlined />}
          {backButton.label}
        </Link>
      )}

      <nav className='flex-1 space-y-1'>
        {menus.map((item) => {
          const isActive = isItemActive(item.href);

          return (
            <Link key={item.href} href={item.href} className='block px-3'>
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  isActive ? 'bg-primary-surface text-primary' : 'text-slate-600 hover:bg-blue-50'
                }`}
              >
                <span className='text-lg'>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
