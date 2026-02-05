'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppstoreOutlined,
  BarChartOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
  ShopOutlined,
  ArrowLeftOutlined,
  LockOutlined,
} from '@ant-design/icons';

const studentMenu = [
  { icon: <AppstoreOutlined />, label: 'Space', href: '/student/space' },
  { icon: <BarChartOutlined />, label: 'Thông tin chung', href: '/student/general-info' },
  { icon: <TeamOutlined />, label: 'Sinh viên', href: '/student/studentlist' },
  { icon: <VideoCameraOutlined />, label: 'Báo cáo hàng ngày', href: '/student/daily-report' },
  { icon: <UploadOutlined />, label: 'Đánh giá', href: '/student/evaluate' },
  { icon: <UserOutlined />, label: 'Bên liên quan', href: '/student/stakeholder' },
  { icon: <ShopOutlined />, label: 'Vi phạm', href: '/student/violation' },
];

const profileMenu = [
  { icon: <UserOutlined />, label: 'Thông tin cá nhân', href: '/student/profile' },
  { icon: <LockOutlined />, label: 'Thay đổi mật khẩu', href: '/student/profile/change-password' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isProfile = pathname.startsWith('/student/profile');
  const menus = isProfile ? profileMenu : studentMenu;

  return (
    <aside className='w-[15.1rem] h-screen bg-gray-50 border-r border-slate-200 sticky top-0 hidden md:flex flex-col'>
      <div className='flex justify-center px-14 py-6'>
        <Image src='https://iocv2.rikkei.edu.vn/logo.svg' alt='IOC Logo' width={120} height={40} />
      </div>

      {isProfile && (
        <Link
          href='/student/space'
          className='mx-4 mb-4 flex items-center gap-2 text-xs font-black text-red-800 cursor-pointer'
        >
          <ArrowLeftOutlined />
          Quay lại
        </Link>
      )}

      <nav className='flex-1 space-y-1'>
        {menus.map((item) => {
          const isActive = pathname === item.href;

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
