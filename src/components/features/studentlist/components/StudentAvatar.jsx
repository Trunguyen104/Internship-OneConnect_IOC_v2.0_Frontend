'use client';

import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

export default function StudentAvatar({ name }) {
  const firstLetter = name?.charAt(0)?.toUpperCase();

  return (
    <Avatar
      size="large"
      icon={!firstLetter && <UserOutlined />}
      className="border-primary/20 bg-primary-surface text-primary border font-semibold"
    >
      {firstLetter}
    </Avatar>
  );
}
