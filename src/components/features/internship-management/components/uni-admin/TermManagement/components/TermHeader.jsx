'use client';
import React, { memo } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const TermHeader = memo(function TermHeader({ onCreateNew }) {
  return (
    <header className='mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <h1 className='text-2xl font-bold text-slate-900'>Danh sách Kỳ thực tập</h1>

      <Button
        icon={<PlusOutlined />}
        onClick={onCreateNew}
        size='medium'
        className='!bg-primary hover:!bg-primary-hover cursor-pointer !border-none font-medium !text-white shadow-sm'
      >
        Thêm Kỳ Mới
      </Button>
    </header>
  );
});

export default TermHeader;
