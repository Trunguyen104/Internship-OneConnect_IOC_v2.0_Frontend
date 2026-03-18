import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

export const ROLE_MAP = {
  1: {
    label: 'Member',
    color: 'default',
  },
  2: {
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
