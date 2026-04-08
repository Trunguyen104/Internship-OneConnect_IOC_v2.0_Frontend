/**
 * Enums for Work Items and Sprints to match Backend Integer values.
 */

export const WORK_ITEM_STATUS = {
  TODO: 1,
  IN_PROGRESS: 2,
  REVIEW: 3,
  DONE: 4,
  CANCELLED: 5,
};

export const WORK_ITEM_TYPE = {
  EPIC: 1,
  USER_STORY: 2,
  TASK: 3,
  SUBTASK: 4,
};

export const WORK_ITEM_PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export const SPRINT_STATUS = {
  PLANNED: 1,
  ACTIVE: 2,
  COMPLETED: 3,
};

export const MOVE_INCOMPLETE_ITEMS_OPTION = {
  TO_BACKLOG: 1,
  TO_NEXT_PLANNED_SPRINT: 2,
  CREATE_NEW_SPRINT: 3,
};

// Map numbers back to strings for UI logic if needed
export const STATUS_MAP = Object.fromEntries(
  Object.entries(WORK_ITEM_STATUS).map(([k, v]) => [v, k])
);
export const TYPE_MAP = Object.fromEntries(Object.entries(WORK_ITEM_TYPE).map(([k, v]) => [v, k]));
export const PRIORITY_MAP = Object.fromEntries(
  Object.entries(WORK_ITEM_PRIORITY).map(([k, v]) => [v, k])
);
export const SPRINT_STATUS_MAP = Object.fromEntries(
  Object.entries(SPRINT_STATUS).map(([k, v]) => [v, k])
);
export const MOVING_INCOMPLETE_ITEMS_OPTION_MAP = Object.fromEntries(
  Object.entries(MOVE_INCOMPLETE_ITEMS_OPTION).map(([k, v]) => [v, k])
);

export const UNASSIGNED_ID = '00000000-0000-0000-0000-000000000000';

export const USER_ROLE = {
  SUPER_ADMIN: 1,
  SCHOOL_ADMIN: 3,
  ENTERPRISE_ADMIN: 4,
  HR: 5,
  MENTOR: 6,
  STUDENT: 7,
};

export const USER_ROLE_MAP = Object.fromEntries(Object.entries(USER_ROLE).map(([k, v]) => [v, k]));
