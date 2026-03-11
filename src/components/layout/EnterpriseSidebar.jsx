'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';

const enterpriseMenu = [
  { icon: <AppstoreOutlined />, label: 'Dashboard', href: '/dashboard' },
  { icon: <UserOutlined />, label: 'My Profile', href: '/profile' },
];

export default function EnterpriseSidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-[15.1rem] h-screen bg-gray-50 border-r border-slate-200 sticky top-0 hidden md:flex flex-col'>
      <div className='flex justify-center px-14 py-6'>
        <Image src='/assets/images/logo.svg' alt='IOC Logo' width={120} height={40} priority />
      </div>

      <nav className='flex-1 space-y-1 mt-4'>
        {enterpriseMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className='block px-3'>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold transition-colors
                ${
                  isActive
                    ? 'bg-[#FEF2F2] text-[#B91C1C]'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
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

