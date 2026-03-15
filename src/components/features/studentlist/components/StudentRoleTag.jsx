import { Tag } from 'antd';
import { ROLE_MAP } from '../constants/roleMap';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

export default function StudentRoleTag({ role }) {
  const r = ROLE_MAP[role] || {
    label: STUDENT_LIST_UI.STATUS.UNKNOWN,
    color: 'default',
  };

  return (
    <Tag color={r.color} variant='filled'>
      {r.label}
    </Tag>
  );
}
