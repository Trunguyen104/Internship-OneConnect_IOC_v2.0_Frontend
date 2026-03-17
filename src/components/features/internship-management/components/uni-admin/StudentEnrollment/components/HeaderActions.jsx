'use client';

import React, { memo } from 'react';
import { Button, Space, Typography } from 'antd';
import { UserAddOutlined, UploadOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title } = Typography;

const HeaderActions = memo(function HeaderActions({
  onImport,
  onAdd,
  onWithdraw,
  canWithdraw = false,
}) {
  const { STUDENT_ENROLLMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  return (
    <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
      <Space size='middle' wrap>
        <Button
          type='primary'
          icon={<UserAddOutlined />}
          className='bg-primary h-11 rounded-xl border-none px-6 font-bold shadow-md transition-all hover:scale-105 active:scale-95'
          onClick={onAdd}
        >
          {STUDENT_ENROLLMENT.ADD_BTN}
        </Button>

        <Button
          icon={<UserDeleteOutlined />}
          className='h-11 rounded-xl px-6 font-bold disabled:opacity-50'
          disabled={!canWithdraw}
          onClick={onWithdraw}
        >
          {STUDENT_ENROLLMENT.WITHDRAW_BTN}
        </Button>
        <Button
          icon={<UploadOutlined className='text-primary' />}
          className='border-border h-11 rounded-xl px-6 font-bold transition-all hover:bg-slate-50'
          onClick={onImport}
        >
          {STUDENT_ENROLLMENT.IMPORT_BTN}
        </Button>
      </Space>
    </div>
  );
});

export default HeaderActions;
