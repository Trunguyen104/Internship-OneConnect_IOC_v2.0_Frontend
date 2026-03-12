'use client';

import React from 'react';
import { Card, Button, Avatar, Tag, Typography, Tooltip } from 'antd';
import { CodeOutlined, DeleteOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { MOCK_MENTORS } from '../../hooks/useGroupManagement';

const { Title } = Typography;

export function GroupCard({ group, onAssign, onDelete, onView }) {
  const mentor = MOCK_MENTORS.find((m) => m.id === group.mentorId);
  const isArchived = group.status === 'ARCHIVED';

  return (
    <Card
      key={group.id}
      className={`group rounded-[32px] border-none shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isArchived ? 'bg-white/60 grayscale' : 'bg-white'}`}
      styles={{ body: { padding: 32 } }}
    >
      <div className='mb-6 flex items-start justify-between'>
        <div
          className={`rounded-2xl p-4 ${isArchived ? 'bg-slate-100 text-slate-400' : 'bg-primary/5 text-primary'}`}
        >
          <CodeOutlined className='text-xl' />
        </div>
        <div className='flex items-center gap-3'>
          <Tag
            className={`rounded-full border-none px-4 py-1.5 text-[11px] font-extrabold tracking-widest uppercase ${group.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
          >
            {group.status}
          </Tag>
          <Tooltip title='Delete Group'>
            <Button
              type='text'
              shape='circle'
              icon={
                <DeleteOutlined className='text-slate-300 transition-colors hover:text-rose-500' />
              }
              onClick={() => onDelete(group)}
              className='flex items-center justify-center border-none bg-slate-50 hover:bg-rose-50'
            />
          </Tooltip>
        </div>
      </div>

      <div className='mb-8'>
        <Title
          level={4}
          className={`!mb-2 !text-xl !font-extrabold ${isArchived ? 'text-slate-500' : 'text-slate-900'}`}
        >
          {group.name}
        </Title>
        <div className='flex items-center gap-2.5 font-medium text-slate-500'>
          {mentor ? (
            <UserOutlined className='text-primary' />
          ) : (
            <PlusOutlined className='text-slate-300' />
          )}
          <span className='text-sm'>
            Mentor:{' '}
            <span
              className={`${mentor ? 'decoration-primary/30 text-slate-900 underline' : 'text-slate-400 italic'}`}
            >
              {mentor?.name || 'Not Assigned'}
            </span>
          </span>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Avatar.Group
            maxCount={4}
            size='large'
            className={isArchived ? 'opacity-50 grayscale' : ''}
          >
            {group.avatars.map((url, i) => (
              <Avatar key={i} src={url} />
            ))}
          </Avatar.Group>
          <span
            className={`text-sm font-medium ${isArchived ? 'text-slate-300' : 'text-slate-400'}`}
          >
            {group.memberCount} members
          </span>
        </div>

        <div className='flex flex-col gap-4 pt-6'>
          <Button
            className={`h-14 w-full rounded-2xl border-none py-3 text-sm font-extrabold shadow-sm transition-all ${isArchived ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:bg-red-700 hover:shadow-lg active:scale-[0.98]'}`}
            onClick={() => !isArchived && onAssign(group)}
          >
            {mentor ? 'Change Mentor' : 'Assign Mentor'}
          </Button>
          <button
            className={`hover:letter-spacing-[0.25em] cursor-pointer text-center text-[11px] font-extrabold tracking-[0.2em] uppercase transition-all ${isArchived ? 'text-slate-300' : 'hover:text-primary text-slate-400 hover:tracking-[0.3em]'}`}
            onClick={() => onView(group)}
          >
            {isArchived ? 'View Archive' : 'View Details'}
          </button>
        </div>
      </div>
    </Card>
  );
}
