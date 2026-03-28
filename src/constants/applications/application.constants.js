/**
 * Internship Application Status Enum (Matching Backend)
 */
export const APPLICATION_STATUS = {
  APPLIED: 1,
  INTERVIEWING: 2,
  OFFERED: 3,
  PENDING_ASSIGNMENT: 4,
  PLACED: 5,
  REJECTED: 6,
  WITHDRAWN: 7,
};

/**
 * Application Source Enum (Matching Backend)
 */
export const APPLICATION_SOURCE = {
  SELF_APPLY: 1,
  UNI_ASSIGN: 2,
};

/**
 * Labels and Styles for UI Display
 */
export const APPLICATION_STATUS_CONFIG = {
  [APPLICATION_STATUS.APPLIED]: {
    label: 'Applied',
    color: 'blue',
    variant: 'secondary',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  [APPLICATION_STATUS.INTERVIEWING]: {
    label: 'Interviewing',
    color: 'purple',
    variant: 'secondary',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
  },
  [APPLICATION_STATUS.OFFERED]: {
    label: 'Offered',
    color: 'orange',
    variant: 'secondary',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
  },
  [APPLICATION_STATUS.PENDING_ASSIGNMENT]: {
    label: 'Pending Assignment',
    color: 'cyan',
    variant: 'secondary',
    textColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-100',
  },
  [APPLICATION_STATUS.PLACED]: {
    label: 'Placed',
    color: 'green',
    variant: 'success',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Rejected',
    color: 'red',
    variant: 'danger',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-100',
  },
  [APPLICATION_STATUS.WITHDRAWN]: {
    label: 'Withdrawn',
    color: 'gray',
    variant: 'muted',
    textColor: 'text-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-100',
  },
};

/**
 * Group of terminal statuses for filtering logic
 */
export const TERMINAL_STATUSES = [
  APPLICATION_STATUS.PLACED,
  APPLICATION_STATUS.REJECTED,
  APPLICATION_STATUS.WITHDRAWN,
];

/**
 * Group of initial statuses for default filtering
 */
export const ACTIVE_STATUSES = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.INTERVIEWING,
  APPLICATION_STATUS.OFFERED,
  APPLICATION_STATUS.PENDING_ASSIGNMENT,
];
