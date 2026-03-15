import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

export const STUDENT_STATUS_MAP = {
  0: {
    label: 'Pending',
    style: 'bg-slate-50 text-slate-500',
    dot: 'bg-slate-300',
  },
  1: {
    label: 'Registered',
    style: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400',
  },
  2: {
    label: 'Onboarded',
    style: 'bg-purple-50 text-purple-600',
    dot: 'bg-purple-500',
  },
  3: {
    label: 'In Progress',
    style: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  4: {
    label: 'Completed',
    style: 'bg-blue-50 text-blue-600',
    dot: 'bg-blue-500',
  },
  5: {
    label: 'Failed',
    style: 'bg-red-50 text-red-600',
    dot: 'bg-red-500',
  },
  Registered: {
    label: STUDENT_LIST_UI.STATUS.REGISTERED,
    style: 'bg-muted/10 text-muted',
    dot: 'bg-muted/50',
  },
  Onboarded: {
    label: STUDENT_LIST_UI.STATUS.ONBOARDED,
    style: 'bg-info-surface text-info',
    dot: 'bg-info',
  },
  InProgress: {
    label: STUDENT_LIST_UI.STATUS.IN_PROGRESS,
    style: 'bg-success-surface text-success',
    dot: 'bg-success',
  },
  Completed: {
    label: STUDENT_LIST_UI.STATUS.COMPLETED,
    style: 'bg-info-surface text-info',
    dot: 'bg-info',
  },
  Failed: {
    label: STUDENT_LIST_UI.STATUS.FAILED,
    style: 'bg-danger-surface text-danger',
    dot: 'bg-danger',
  },
};
