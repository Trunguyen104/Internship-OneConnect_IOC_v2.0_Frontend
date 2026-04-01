'use client';

import { clsx } from 'clsx';
import {
  AlertOctagon,
  ArrowLeft,
  CalendarCheck,
  ClipboardCheck,
  FolderKanban,
  Info,
  LayoutDashboard,
  UserCircle,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

/**
 * Sidebar (Legacy Contextual)
 * Note: This component is used specifically for the Internship Group Space.
 * It has been refactored to be standalone (removing BaseSidebar dependency).
 */
export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const internshipGroupId = params?.internshipGroupId;
  const returnTo = searchParams?.get('returnTo');

  const studentMenu = useMemo(() => {
    const prefix = internshipGroupId
      ? `/internship-groups/${internshipGroupId}`
      : '/internship-groups';

    return [
      { icon: <LayoutDashboard className="size-4" />, label: 'Space', href: `${prefix}/space` },
      {
        icon: <Info className="size-4" />,
        label: 'General Information',
        href: `${prefix}/general-info`,
      },
      { icon: <FolderKanban className="size-4" />, label: 'Project', href: `${prefix}/project` },
      { icon: <Users className="size-4" />, label: 'Students', href: `${prefix}/studentlist` },
      {
        icon: <CalendarCheck className="size-4" />,
        label: 'Daily Report',
        href: `${prefix}/daily-report`,
      },
      {
        icon: <ClipboardCheck className="size-4" />,
        label: 'Evaluation',
        href: `${prefix}/evaluate`,
      },
      {
        icon: <UserCircle className="size-4" />,
        label: 'Stakeholders',
        href: `${prefix}/stakeholder`,
      },
      {
        icon: <AlertOctagon className="size-4" />,
        label: 'Violations',
        href: `${prefix}/violation`,
      },
    ];
  }, [internshipGroupId]);

  const isProfile = pathname.startsWith('/profile');

  const getBackButton = () => {
    if (isProfile) {
      const href =
        returnTo ||
        (internshipGroupId
          ? `/internship-groups/${internshipGroupId}/space`
          : '/internship-groups');
      return { href, label: 'Back' };
    }
    if (pathname !== '/internship-groups' && pathname !== '/student-dashboard') {
      return { href: '/internship-groups', label: 'Back to Groups' };
    }
    return null;
  };

  const backButton = getBackButton();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-gray-100 bg-white/80 transition-all duration-300 md:flex">
      <div className="flex flex-1 flex-col p-4">
        {backButton && (
          <Link
            href={backButton.href}
            className="group mb-4 flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 text-sm font-black transition-all hover:bg-white hover:shadow-sm text-primary"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="size-3" />
            </div>
            <span>{backButton.label}</span>
          </Link>
        )}

        <nav className="space-y-1">
          {studentMenu.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'group relative flex items-center gap-4 rounded-xl px-4 py-2.5 transition-all duration-300',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-black tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
