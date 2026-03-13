'use client';

import React from 'react';
import { Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const InternshipHeader = ({ onAddClick }) => {
  return (
    <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
      <h1 className='text-2xl font-bold text-slate-900'>Internship Students List</h1>
      <Button
        type='primary'
        size='medium'
        icon={<UserAddOutlined />}
        className='!bg-primary hover:!bg-primary-hover cursor-pointer !border-none font-medium !text-white shadow-sm'
        onClick={onAddClick}
      >
        Add New Student
      </Button>
    </div>
  );
};

export default InternshipHeader;
