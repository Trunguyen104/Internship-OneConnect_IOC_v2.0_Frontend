'use client';

import React, { memo } from 'react';
import { Button, Space } from 'antd';
import { UserAddOutlined, UploadOutlined, UserDeleteOutlined } from '@ant-design/icons';

const HeaderActions = memo(function HeaderActions({
  onImport,
  onAdd,
  onWithdraw,
  canWithdraw = false,
}) {
  return (
    <>
      <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Term Students</h1>
        </div>

        <Space size='middle' wrap>
          <Button
            type='primary'
            icon={<UserAddOutlined />}
            size='middle'
            className='bg-primary shadow-primary/20 hover:!bg-primary/90 rounded-full border-none font-bold shadow-md'
            onClick={onAdd}
          >
            Thêm sinh viên
          </Button>

          <Button
            icon={<UploadOutlined />}
            size='middle'
            className='border-primary/20 text-primary hover:!border-primary hover:!bg-primary/5 hover:!text-primary rounded-full font-bold'
            onClick={onImport}
          >
            Nhập từ Excel
          </Button>

          <Button
            icon={<UserDeleteOutlined />}
            size='middle'
            className='rounded-full border-slate-200 bg-slate-50 text-slate-400'
            disabled={!canWithdraw}
            onClick={onWithdraw}
          >
            Rút lui
          </Button>
        </Space>
      </div>
    </>
  );
});

export default HeaderActions;
