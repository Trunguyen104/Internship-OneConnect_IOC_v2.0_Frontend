import { APPLICATION_STATUS } from '@/constants/applications/application.constants';

/**
 * Centralized UI configuration for student application statuses.
 * Defines variants, labels, and Tailwind color classes.
 */
export const STUDENT_APPLICATION_STATUS_UI = {
  [APPLICATION_STATUS.APPLIED]: {
    variant: 'warning-soft',
    label: 'APPLIED',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  [APPLICATION_STATUS.INTERVIEWING]: {
    variant: 'blue',
    label: 'INTERVIEWING',
    showDot: true,
    banner: {
      color: 'blue',
      className: 'bg-blue-50 border-blue-100 text-blue-700',
    },
  },
  [APPLICATION_STATUS.OFFERED]: {
    variant: 'warning',
    label: 'OFFERED',
    banner: {
      color: 'orange',
      className: 'bg-orange-50 border-orange-100 text-orange-700',
    },
  },
  [APPLICATION_STATUS.PLACED]: {
    variant: 'success',
    label: 'PLACED',
    banner: {
      color: 'green',
      className: 'bg-green-50 border-green-100 text-green-700',
    },
  },
  [APPLICATION_STATUS.REJECTED]: {
    variant: 'danger',
    label: 'REJECTED',
    banner: {
      color: 'rose',
      className: 'bg-rose-50 border-rose-100 text-rose-700',
    },
  },
  [APPLICATION_STATUS.WITHDRAWN]: {
    variant: 'neutral',
    label: 'WITHDRAWN',
  },
  [APPLICATION_STATUS.PENDING_ASSIGNMENT]: {
    variant: 'warning-soft',
    label: 'PENDING REVIEW',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    banner: {
      color: 'indigo',
      className: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    },
  },
};
