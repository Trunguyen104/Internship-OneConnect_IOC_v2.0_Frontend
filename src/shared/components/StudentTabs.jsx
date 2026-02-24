'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentTabs() {
  const pathname = usePathname();

  const items = [
    { label: 'Tóm tắt', href: '/student/space' },
    { label: 'Bảng công việc', href: '/student/job-board' },
    { label: 'Sprint Backlog', href: '/student/backlog/sprint' },
    { label: 'Product Backlog', href: '/student/backlog/product' },
  ];

  return (
    <div className='min-w-0'>
      <div className='flex gap-3 whitespace-nowrap overflow-x-auto py-1'>
        {items.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + '/');

          return (
            <Link
              key={t.href}
              href={t.href}
              className={[
                // base pill
                'shrink-0 inline-flex items-center',
                'px-5 py-3 rounded-2xl',
                'text-sm font-semibold',
                'border transition-colors duration-150',
                'shadow-sm',

                // inactive
                !active &&
                  [
                    'bg-[var(--color-surface)]',
                    'text-[var(--color-text)]',
                    'border-[var(--color-border)]',
                    'hover:bg-[var(--gray-100)]',
                  ].join(' '),

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
