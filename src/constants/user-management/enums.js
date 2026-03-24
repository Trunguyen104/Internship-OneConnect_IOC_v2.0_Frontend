// Enums aligned with Backend integer values (IOCv2.Domain.Enums).

export const USER_ROLE = {
  SUPER_ADMIN: 1,
  MODERATOR: 2,
  SCHOOL_ADMIN: 3,
  ENTERPRISE_ADMIN: 4,
  HR: 5,
  MENTOR: 6,
  STUDENT: 7,
};

export const USER_STATUS = {
  INACTIVE: 1,
  ACTIVE: 2,
  SUSPENDED: 3,
};

export const USER_ROLE_LABEL = {
  [USER_ROLE.SUPER_ADMIN]: 'SuperAdmin',
  [USER_ROLE.MODERATOR]: 'Moderator',
  [USER_ROLE.SCHOOL_ADMIN]: 'Uni Admin',
  [USER_ROLE.ENTERPRISE_ADMIN]: 'Ent Admin',
  [USER_ROLE.HR]: 'HR',
  [USER_ROLE.MENTOR]: 'Mentor',
  [USER_ROLE.STUDENT]: 'Student',
};

export const USER_STATUS_LABEL = {
  [USER_STATUS.INACTIVE]: 'Inactive',
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.SUSPENDED]: 'Suspended',
};
