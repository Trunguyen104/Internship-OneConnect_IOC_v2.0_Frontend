'use client';

import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function StudentAvatar({ name }) {
  const firstLetter = name?.charAt(0)?.toUpperCase();

  return (
    <Avatar
      size='large'
      icon={!firstLetter && <UserOutlined />}
      className='border border-[var(--primary-200)] bg-[var(--primary-100)] font-semibold text-[var(--primary-700)]'
    >
      {firstLetter}
    </Avatar>
  );
}
