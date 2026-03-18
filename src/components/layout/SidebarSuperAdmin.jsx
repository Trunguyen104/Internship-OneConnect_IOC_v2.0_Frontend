'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TeamOutlined, BankOutlined, ApartmentOutlined } from '@ant-design/icons';

const superAdminMenu = [
  { icon: <TeamOutlined />, label: 'Admin Users', href: '/admin-users' },
  { icon: <BankOutlined />, label: 'Universities', href: '/universities' },
  { icon: <ApartmentOutlined />, label: 'Enterprises', href: '/enterprises' },
];

export default function SidebarSuperAdmin() {
  const pathname = usePathname();

  return (
    <aside className='sticky top-0 hidden h-screen w-[15.1rem] flex-col border-r border-slate-200 bg-gray-50 md:flex'>
      <div className='flex justify-center px-14 py-6'>
        <Image src='/assets/images/logo.svg' alt='IOC Logo' width={120} height={40} />
      </div>

      <nav className='mt-4 flex-1 space-y-1'>
        {superAdminMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className='block px-3'>
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold ${
                  isActive ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'text-slate-600 hover:bg-blue-50'
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

