'use client';

import React from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

export function GroupHeader({ onCreate }) {
  const { TITLE, CREATE_BTN } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT;

  return (
    <div className='flex items-center justify-between py-6'>
      <h1 className='text-text text-2xl font-bold tracking-tight'>{TITLE}</h1>

      <Button
        type='primary'
        icon={<PlusOutlined />}
        className='bg-primary h-11 border-none px-6 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
        onClick={onCreate}
      >
        {CREATE_BTN}
      </Button>
    </div>
  );
}
