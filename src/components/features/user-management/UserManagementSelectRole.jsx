'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import Select from '@/components/ui/select';
import { USER_ROLE, USER_ROLE_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';

export default function UserManagementSelectRole() {
  const options = Object.values(USER_ROLE).map((v) => ({
    label: USER_ROLE_LABEL[v] || String(v),
    value: String(v),
  }));

  return (
    <Field>
      <FieldLabel>{UI_TEXT.ROLE.TITLE}</FieldLabel>
      <Select
        name="role"
        required
        defaultValue={String(USER_ROLE.MODERATOR)}
        options={options}
        className="!rounded-xl"
        placeholder={UI_TEXT.ROLE.TITLE}
      />
    </Field>
  );
}
