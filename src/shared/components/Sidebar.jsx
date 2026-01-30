'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppstoreOutlined,
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const menuItems = [
  { icon: <AppstoreOutlined />, label: 'Space', href: '/space' },
  { icon: <BarChartOutlined />, label: 'Thông tin chung', href: '/student/generalinfo' },
  { icon: <TeamOutlined />, label: 'Sinh viên', href: '/student/studentlist' },
  { icon: <VideoCameraOutlined />, label: 'Báo cáo hàng ngày', href: '/student/daily-report' },
  { icon: <UploadOutlined />, label: 'Đánh giá', href: '/student/evaluate' },
  { icon: <UserOutlined />, label: 'Bên liên quan', href: '/student/stakeholder' },
  { icon: <ShopOutlined />, label: 'Vi phạm', href: '/student/violation' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='font-sidebar w-[15.1rem] h-screen bg-gray-50 border-r border-slate-200 sticky top-0 hidden md:flex flex-col'>
      {/* Logo */}
      <div className='flex items-center justify-center px-14 py-6'>
        <Image
          src='https://iocv2.rikkei.edu.vn/logo.svg'
          alt='IOC Logo'
          width={120}
          height={40}
          priority
        />
      </div>

      {/* Back */}
      <div className='mx-4 mb-4 mt-3 flex items-center gap-2 text-xs font-black text-red-800 cursor-pointer'>
        <ArrowLeftOutlined className='text-base' />
        Trở lại trang trước
      </div>

      {/* Menu */}
      <nav className='flex-1 space-y-1'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className='block px-3'>
              <div
                className={`
                  flex items-center gap-3 px-4 py-2 text-sm font-semibold rounded-xl
                  transition-colors
                  ${isActive ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'text-gray-900 hover:bg-blue-50'}
                `}
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
