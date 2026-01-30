'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentTabs() {
  const pathname = usePathname();

  const items = [
    { label: 'Tóm tắt', href: '/student/dashboard' },
    { label: 'Bảng công việc', href: '/student/job-board' },
    { label: 'Backlog', href: '/student/backlog' },
    { label: 'Danh sách công việc', href: '/student/studentlist' },
  ];

  return (
    <div className='flex gap-4 whitespace-nowrap'>
      {items.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + '/');
        return (
          <Link
            key={t.href}
            href={t.href}
            className={[
              'text-sm px-4 py-2 rounded-full border',
              'border-border/60 bg-surface shadow-sm',
              active ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-bg',
            ].join(' ')}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
