'use client';

import { useMemo } from 'react';

import Select from '@/components/ui/select';
import { USER_ROLE, USER_ROLE_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

/**
 * @param {'default' | 'enterpriseStaff'} [props.variant] - enterpriseStaff: filter only HR & Mentor (same enterprise scope is enforced by API).
 */
export default function UserManagementFilter({ variant = 'default' }) {
  const currentFilter = useAdminUsersStore((s) => s.currentFilter);

  const handleRoleChange = (role) => {
    useAdminUsersStore.setFilter({ role });
  };

  const roleOptions = useMemo(() => {
    if (variant === 'enterpriseStaff') {
      return [
        { label: UI_TEXT.USER_MANAGEMENT.ALL_USERS, value: 'all' },
        { label: USER_ROLE_LABEL[USER_ROLE.HR], value: String(USER_ROLE.HR) },
        { label: USER_ROLE_LABEL[USER_ROLE.MENTOR], value: String(USER_ROLE.MENTOR) },
      ];
    }
    return [
      { label: UI_TEXT.USER_MANAGEMENT.ALL_USERS, value: 'all' },
      ...Object.values(USER_ROLE).map((v) => ({
        label: USER_ROLE_LABEL[v] || String(v),
        value: String(v),
      })),
    ];
  }, [variant]);

  return (
    <div className="flex items-center gap-3">
      <Select
        value={currentFilter.role}
        onChange={handleRoleChange}
        options={roleOptions}
        className="!w-36 !rounded-xl !h-9 text-xs"
        placeholder={UI_TEXT.USER_MANAGEMENT.ROLE}
      />
    </div>
  );
}
