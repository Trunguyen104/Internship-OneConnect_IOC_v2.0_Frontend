'use client';

import React from 'react';
import { Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const InternshipHeader = ({ onAddClick }) => {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;

  return (
    <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
      <h1 className='text-text text-2xl font-bold'>{INTERNSHIP_LIST.TITLE}</h1>
      <Button
        type='primary'
        icon={<UserAddOutlined />}
        className='bg-primary h-11 border-none px-6 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
        onClick={onAddClick}
      >
        {INTERNSHIP_LIST.ADD_STUDENT_BTN}
      </Button>
    </div>
  );
};

export default InternshipHeader;
