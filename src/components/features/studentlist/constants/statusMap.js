import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

export const STUDENT_STATUS_MAP = {
  0: {
    label: 'Pending',
    style: 'bg-muted/10 text-muted',
    dot: 'bg-muted/50',
  },
  1: {
    label: 'Registered',
    style: 'bg-muted/10 text-muted',
    dot: 'bg-muted/50',
  },
  2: {
    label: 'Onboarded',
    style: 'bg-info-surface text-info',
    dot: 'bg-info',
  },
  3: {
    label: 'In Progress',
    style: 'bg-success-surface text-success',
    dot: 'bg-success',
  },
  4: {
    label: 'Completed',
    style: 'bg-info-surface text-info',
    dot: 'bg-info',
  },
  5: {
    label: 'Failed',
    style: 'bg-danger-surface text-danger',
    dot: 'bg-danger',
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
