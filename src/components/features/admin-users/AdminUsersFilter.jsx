'use client';

import { Filter } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { USER_ROLE, USER_ROLE_LABEL } from '@/constants/admin-users/enums';
import { UI_TEXT } from '@/lib/UI_Text';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import { adminUsersService } from './adminUsers.service';

export default function AdminUsersFilter() {
  const handleSelectedRole = async (value) => {
    try {
      const params = {
        PageNumber: 1,
        PageSize: 100,
        Role: value === 'all' ? undefined : Number(value),
      };
      const res = await adminUsersService.getList(params);
      const data = res?.data ?? res;
      useAdminUsersStore.setUsers(data?.items ?? data?.Items ?? []);
    } catch {
      useAdminUsersStore.setUsers([]);
    }
  };

  return (
    <Select defaultValue="all" onValueChange={handleSelectedRole}>
      <SelectTrigger className="flex w-auto items-center gap-2 px-2 md:w-26">
        <Filter className="h-4 w-4 md:hidden" />
        <span className="hidden md:inline">
          <SelectValue placeholder={UI_TEXT.COMMON.FILTER} />
        </span>
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectItem value="all">{UI_TEXT.COMMON.ALL}</SelectItem>
        {Object.values(USER_ROLE).map((v) => (
          <SelectItem key={String(v)} value={String(v)}>
            {USER_ROLE_LABEL[v] || String(v)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
