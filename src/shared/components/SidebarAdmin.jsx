'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const adminMenu = [
  { icon: <DashboardOutlined />, label: 'Dashboard', href: '/uni-admin/dashboard' },
  { icon: <CalendarOutlined />, label: 'Kỳ thực tập', href: '/uni-admin/internship-terms' },
  { icon: <TeamOutlined />, label: 'Quản lí Sinh viên', href: '/uni-admin/enrollments' },
  { icon: <BarChartOutlined />, label: 'Báo cáo', href: '/uni-admin/reports' },
  { icon: <SettingOutlined />, label: 'Cài đặt', href: '/uni-admin/settings' },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className='w-[15.1rem] h-screen bg-gray-50 border-r border-slate-200 sticky top-0 hidden md:flex flex-col'>
      <div className='flex justify-center px-14 py-6'>
        <Image src='/assets/images/logo.svg' alt='IOC Logo' width={120} height={40} />
      </div>

      <Link
        href='/internship-groups'
        className='mx-5 mb-6 flex items-center gap-2 text-[14px] font-bold text-[var(--primary-700)] hover:text-[var(--primary-800)] cursor-pointer'
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
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold
                ${isActive ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'hover:bg-blue-50'}`}
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
