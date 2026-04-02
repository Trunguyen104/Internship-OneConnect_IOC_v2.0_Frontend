'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function StudentTabs() {
  const pathname = usePathname();
  const params = useParams();
  const internshipGroupId = params?.internshipGroupId;

  const basePath = internshipGroupId
    ? `/internship-groups/${internshipGroupId}`
    : '/internship-groups';

  const items = [
    { label: 'Summary', href: `${basePath}/space` },
    { label: 'Work Board', href: `${basePath}/work-board` },
    { label: 'Backlog Board', href: `${basePath}/backlog` },
    { label: 'Projects', href: `${basePath}/project` },
  ];

  return (
    <div className="min-w-0">
      <div className="flex gap-3 overflow-x-auto py-1 whitespace-nowrap">
        {items.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + '/');

          return (
            <Link
              key={t.href}
              href={t.href}
              className={`inline-flex shrink-0 items-center rounded-2xl border px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-150 ${
                active
                  ? 'text-text! border-slate-900! bg-white'
                  : 'text-text! border-border hover:bg-bg bg-white'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
