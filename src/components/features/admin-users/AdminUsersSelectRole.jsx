'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UI_TEXT } from '@/lib/UI_Text';
import { USER_ROLE, USER_ROLE_LABEL } from '@/constants/admin-users/enums';

export default function AdminUsersSelectRole() {
  return (
    <Field>
      <FieldLabel>{UI_TEXT.ROLE.TITLE}</FieldLabel>
      <Select name='role' required defaultValue={String(USER_ROLE.MODERATOR)}>
        <SelectTrigger>
          <SelectValue placeholder={UI_TEXT.ROLE.TITLE} />
        </SelectTrigger>
        <SelectContent position='popper'>
          {Object.values(USER_ROLE).map((v) => (
            <SelectItem key={String(v)} value={String(v)} className='rounded-xl'>
              {USER_ROLE_LABEL[v] || String(v)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
