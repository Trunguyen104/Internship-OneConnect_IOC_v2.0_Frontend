'use client';

import React, { memo } from 'react';
import { Drawer, Select, Input, Button } from 'antd';
import {
  CloseOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const STATUS_OPTIONS = [
  { value: 'unplaced', label: 'Unplaced' },
  { value: 'placed', label: 'Placed' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const StudentDetailsDrawer = memo(function StudentDetailsDrawer({
  visible,
  onClose,
  student,
  onUpdate,
}) {
  if (!student) return null;

  const avatar = student.avatar || '/images/default-avatar.png';
  const email = student.email ?? `${student.id.toLowerCase()}@university.edu`;

  return (
    <Drawer
      open={visible}
      onClose={onClose}
      width={480}
      placement='right'
      closeIcon={<CloseOutlined />}
      footer={
        <div className='flex gap-4'>
          <Button size='large' className='flex-1' onClick={onClose}>
            Cancel
          </Button>

          <Button
            type='primary'
            size='large'
            className='flex-1'
            onClick={() => onUpdate?.(student)}
          >
            Update Details
          </Button>
        </div>
      }
    >
      <div className='space-y-8 p-6'>
        <div className='flex items-start gap-6'>
          <div
            className='h-24 w-24 rounded-xl bg-cover bg-center'
            style={{ backgroundImage: `url(${avatar})` }}
          />

          <div>
            <h3 className='text-xl font-bold'>{student.name}</h3>

            <p className='text-sm text-slate-500'>ID: {student.id}</p>
          </div>
        </div>

        <section>
          <div className='mb-4 flex items-center gap-2'>
            <InfoCircleOutlined />
            <h2 className='font-bold'>Personal Information</h2>
          </div>

          <div className='rounded-xl border bg-white'>
            <div className='grid grid-cols-3 border-b p-4'>
              <p>Email</p>
              <p className='col-span-2'>{email}</p>
            </div>

            <div className='grid grid-cols-3 border-b p-4'>
              <p>Phone</p>
              <p className='col-span-2'>{student.phone}</p>
            </div>

            <div className='grid grid-cols-3 p-4'>
              <p>Major</p>
              <p className='col-span-2'>{student.major}</p>
            </div>
          </div>
        </section>

        {/* Placement */}
        <section>
          <div className='mb-4 flex items-center gap-2'>
            <SettingOutlined />
            <h2 className='font-bold'>Placement Settings</h2>
          </div>

          <Select value={student.status} options={STATUS_OPTIONS} size='large' className='w-full' />

          <Input
            size='large'
            prefix={<SearchOutlined />}
            placeholder='Search enterprise...'
            className='mt-4'
          />
        </section>
      </div>
    </Drawer>
  );
});

export default StudentDetailsDrawer;
