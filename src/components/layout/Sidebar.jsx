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
  ProjectOutlined,
} from '@ant-design/icons';

const studentMenu = [
  { icon: <AppstoreOutlined />, label: 'Space', href: '/student/space' },
  { icon: <BarChartOutlined />, label: 'General Information', href: '/student/general-info' },
  { icon: <ProjectOutlined />, label: 'Project', href: '/student/project' },
  { icon: <TeamOutlined />, label: 'Students', href: '/student/studentlist' },
  { icon: <VideoCameraOutlined />, label: 'Daily Report', href: '/student/daily-report' },
  { icon: <UploadOutlined />, label: 'Evaluation', href: '/student/evaluate' },
  { icon: <UserOutlined />, label: 'Stakeholders', href: '/student/stakeholder' },
  { icon: <ShopOutlined />, label: 'Violations', href: '/student/violation' },
];

const profileMenu = [
  { icon: <UserOutlined />, label: 'Profile', href: '/student/profile' },
  { icon: <LockOutlined />, label: 'Change Password', href: '/student/profile/change-password' },
];
export default function Sidebar() {
  const pathname = usePathname();

  const isProfile = pathname.startsWith('/student/profile');
  const menus = isProfile ? profileMenu : studentMenu;

  return (
    <aside className='sticky top-0 hidden h-screen w-[15.1rem] flex-col border-r border-slate-200 bg-gray-50 md:flex'>
      <div className='flex justify-center px-14 py-6'>
        <Image src='/assets/images/logo.svg' alt='IOC Logo' width={120} height={40} />
      </div>

      {isProfile ? (
        <Link
          href='/student/space'
          className='mx-4 mb-4 flex cursor-pointer items-center gap-2 text-xs font-black text-red-800 hover:underline'
        >
          <ArrowLeftOutlined />
          Back
        </Link>
      ) : (
        !isProfile &&
        pathname !== '/internship-groups' && (
          <Link
            href='/student/space'
            className='mx-5 mb-6 flex cursor-pointer items-center gap-2 text-[14px] font-bold text-(--primary-700) hover:text-(--primary-800)'
          >
            <ArrowLeftOutlined />
            Back to previous page
          </Link>
        )
      )}

      <nav className='flex-1 space-y-1'>
        {menus.map((item) => {
          const isActive = pathname === item.href;

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
