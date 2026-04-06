import { APPLICATION_STATUS } from '@/constants/applications/application.constants';

/**
 * Centralized UI configuration for student application statuses.
 * Defines variants, labels, and Tailwind color classes.
 */
export const STUDENT_APPLICATION_STATUS_UI = {
  [APPLICATION_STATUS.APPLIED]: {
    variant: 'info',
    label: 'APPLIED',
    showDot: true,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [APPLICATION_STATUS.INTERVIEWING]: {
    variant: 'blue',
    label: 'INTERVIEWING',
    showDot: true,
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    banner: {
      color: 'blue',
      className: 'bg-blue-50 border-blue-100 text-blue-700',
    },
  },
  [APPLICATION_STATUS.OFFERED]: {
    variant: 'warning',
    label: 'OFFERED',
    showDot: true,
    className: 'bg-orange-50 text-orange-700 border-orange-200',
    banner: {
      color: 'orange',
      className: 'bg-orange-50 border-orange-100 text-orange-700',
    },
  },
  [APPLICATION_STATUS.PENDING_ASSIGNMENT]: {
    variant: 'amber',
    label: 'PENDING',
    showDot: true,
    className: 'bg-violet-50 text-violet-700 border-violet-200',
    banner: {
      color: 'violet',
      className: 'bg-violet-50 border-violet-100 text-violet-700',
    },
  },
  [APPLICATION_STATUS.PLACED]: {
    variant: 'success',
    label: 'PLACED',
    showDot: true,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    banner: {
      color: 'green',
      className: 'bg-green-50 border-green-100 text-green-700',
    },
  },
  [APPLICATION_STATUS.REJECTED]: {
    variant: 'danger',
    label: 'REJECTED',
    showDot: true,
    className: 'bg-rose-50 text-rose-700 border-rose-200',
    banner: {
      color: 'rose',
      className: 'bg-rose-50 border-rose-100 text-rose-700',
    },
  },
  [APPLICATION_STATUS.WITHDRAWN]: {
    variant: 'amber',
    label: 'WITHDRAWN',
    showDot: true,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

export const TERMINAL_STATUSES = [
  APPLICATION_STATUS.PLACED,
  APPLICATION_STATUS.REJECTED,
  APPLICATION_STATUS.WITHDRAWN,
];
