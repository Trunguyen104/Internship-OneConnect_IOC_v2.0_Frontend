'use client';

import { UserOutlined } from '@ant-design/icons';
import React from 'react';

import { Avatar } from '@/components/ui/avatar';

export default function StudentAvatar({ name, size = 'large' }) {
  const firstLetter = name?.charAt(0)?.toUpperCase();

  return (
    <Avatar size={size} icon={!firstLetter && <UserOutlined />}>
      {firstLetter}
    </Avatar>
  );
}
