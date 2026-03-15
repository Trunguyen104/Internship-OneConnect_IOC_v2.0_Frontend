'use client';

import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function StudentAvatar({ name }) {
  const firstLetter = name?.charAt(0)?.toUpperCase();

  return (
    <Avatar
      size='large'
      icon={!firstLetter && <UserOutlined />}
      className='border-primary/20 bg-primary-surface text-primary border font-semibold'
    >
      {firstLetter}
    </Avatar>
  );
}
