'use client';

import { Tag } from 'antd';
import { ROLE_MAP } from '../constants/roleMap';

export default function StudentRoleTag({ role }) {
  const r = ROLE_MAP[role] || {
    label: 'Unknown',
    color: 'default',
  };

  return <Tag color={r.color}>{r.label}</Tag>;
}
