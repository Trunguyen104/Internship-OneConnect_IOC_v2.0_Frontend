'use client';

import { DashboardOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const enterpriseMenu = [
  { icon: <DashboardOutlined />, label: 'Dashboard', href: '/dashboard' },
  {
    icon: <SolutionOutlined />,
    label: 'Internship Students',
    href: '/internship-student-management',
  },
  {
    icon: <TeamOutlined />,
    label: 'Internship Groups',
    href: '/internship-group-management',
  },
];

export default function EnterpriseSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[15.1rem] flex-col border-r border-slate-200 bg-gray-50 md:flex">
      <div className="flex justify-center px-14 py-6">
        <Image src="/assets/images/logo.svg" alt="IOC Logo" width={120} height={40} priority />
      </div>

      <nav className="mt-4 flex-1 space-y-1">
        {enterpriseMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className="block px-3">
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#FEF2F2] text-[#B91C1C]'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
