import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

export const ROLE_MAP = {
  0: {
    label: 'Member',
    color: 'default',
  },
  1: {
    label: 'Leader',
    color: 'gold',
  },
  Member: {
    label: STUDENT_LIST_UI.ROLE.MEMBER,
    color: 'default',
  },
  Leader: {
    label: STUDENT_LIST_UI.ROLE.LEADER,
    color: 'warning',
  },
};
