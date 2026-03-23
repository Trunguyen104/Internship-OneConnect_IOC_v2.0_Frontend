'use client';

import { Users } from 'lucide-react';

import { UI_TEXT } from '@/lib/UI_Text';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

export default function UserManagementCount() {
  const count = useAdminUsersStore((s) => s.users.length);
  const title = `${UI_TEXT.USER_MANAGEMENT.TITLE} (${count})`;

  return (
    <div className="flex items-center space-x-2">
      <Users className="h-5 w-5 text-slate-400" />
      <h2 className="text-xl font-semibold tracking-tight text-slate-800">{title}</h2>
    </div>
  );
}
