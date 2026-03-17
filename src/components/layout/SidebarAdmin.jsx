'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

const adminMenu = [
  { icon: <DashboardOutlined />, label: 'Trang chủ', href: '/admin-dashboard' },
  { icon: <CalendarOutlined />, label: 'Kỳ thực tập', href: '/internship-terms' },
  { icon: <TeamOutlined />, label: 'Quản lí Sinh viên', href: '/enrollments' },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className='sticky top-0 hidden h-screen w-[15.1rem] flex-col border-r border-slate-200 bg-gray-50 md:flex'>
      <div className='flex justify-center px-14 py-6'>
        <Image src='/assets/images/logo.svg' alt='IOC Logo' width={120} height={40} />
      </div>

      <Link
        href='/internship-groups'
        className='mx-5 mb-6 flex cursor-pointer items-center gap-2 text-[14px] font-bold text-[var(--primary-700)] hover:text-[var(--primary-800)]'
      >
        <ArrowLeftOutlined />
        Trở lại trang trước
      </Link>

      <nav className='flex-1 space-y-1'>
        {adminMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className='block px-3'>
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold ${isActive ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'hover:bg-blue-50'}`}
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
