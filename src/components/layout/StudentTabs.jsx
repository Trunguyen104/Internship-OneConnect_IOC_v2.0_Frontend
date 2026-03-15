'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentTabs() {
  const pathname = usePathname();

  const items = [
    { label: 'Tóm tắt', href: '/student/space' },
    { label: 'Bảng công việc', href: '/student/work-board' },
    { label: 'Backlog Board', href: '/student/backlog' },
  ];

  return (
    <div className='min-w-0'>
      <div className='flex gap-3 overflow-x-auto py-1 whitespace-nowrap'>
        {items.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + '/');

          return (
            <Link
              key={t.href}
              href={t.href}
              className={[
                // base pill
                'inline-flex shrink-0 items-center',
                'rounded-2xl px-5 py-3',
                'text-sm font-semibold',
                'border transition-colors duration-150',
                'shadow-sm',

                // inactive
                !active &&
                  ['bg-surface', 'text-text', 'border-border', 'hover:bg-[var(--gray-100)]'].join(
                    ' ',
                  ),

                // active — giống "Thông tin chung"
                active &&
                  [
                    'bg-[var(--primary-50)]',
                    'text-[var(--primary-700)]',
                    'border-[var(--primary-100)]',
                  ].join(' '),
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
