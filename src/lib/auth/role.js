import { USER_ROLE } from '@/constants/user-management/enums';

/** Mirrors `normalizeRole` in `src/lib/server/auth-session.js` for client-side UI. */
const ROLE_NAME_TO_ID = {
  superadmin: USER_ROLE.SUPER_ADMIN,
  schooladmin: USER_ROLE.SCHOOL_ADMIN,
  enterpriseadmin: USER_ROLE.ENTERPRISE_ADMIN,
  hr: USER_ROLE.HR,
  mentor: USER_ROLE.MENTOR,
  student: USER_ROLE.STUDENT,
};

export function normalizeRoleToId(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value;

  const asNumber = Number(value);
  if (!Number.isNaN(asNumber)) return asNumber;

  const key = String(value)
    .replace(/[\s_-]/g, '')
    .toLowerCase();
  return ROLE_NAME_TO_ID[key] ?? null;
}
