'use client';

import { Filter } from 'lucide-react';

import Select from '@/components/ui/select';
import { USER_ROLE, USER_ROLE_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import { userManagementService } from './userManagement.service';

export default function UserManagementFilter() {
  const handleSelectedRole = async (value) => {
    try {
      const params = {
        PageNumber: 1,
        PageSize: 100,
        Role: value === 'all' ? undefined : Number(value),
      };
      const res = await userManagementService.getList(params);
      const data = res?.data ?? res;
      useAdminUsersStore.setUsers(data?.items ?? data?.Items ?? []);
    } catch {
      useAdminUsersStore.setUsers([]);
    }
  };

  const options = [
    { label: UI_TEXT.COMMON.ALL, value: 'all' },
    ...Object.values(USER_ROLE).map((v) => ({
      label: USER_ROLE_LABEL[v] || String(v),
      value: String(v),
    })),
  ];

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted md:hidden" />
      <Select
        defaultValue="all"
        onChange={handleSelectedRole}
        options={options}
        className="!w-40 !rounded-2xl"
        placeholder={UI_TEXT.COMMON.FILTER}
      />
    </div>
  );
}
