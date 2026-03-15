'use client';

import React, { memo } from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title } = Typography;

const TermHeader = memo(function TermHeader({ onCreateNew }) {
  const { TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  return (
    <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
      <div>
        <Title level={2} className='text-text !mb-0 tracking-tight'>
          {TERM_MANAGEMENT.TITLE}
        </Title>
      </div>

      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={onCreateNew}
        className='bg-primary h-11 rounded-xl border-none px-6 font-bold shadow-md transition-all hover:scale-105 active:scale-95'
      >
        {TERM_MANAGEMENT.CREATE_BTN}
      </Button>
    </div>
  );
});

export default TermHeader;
