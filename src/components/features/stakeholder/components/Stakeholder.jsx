'use client';

import React, { useState } from 'react';
import StakeholderTab from './StakeholderTab';
import IssueTab from './IssueTab';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { UserOutlined, WarningOutlined } from '@ant-design/icons';

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder');

  return (
    <section className='animate-in fade-in flex min-h-0 flex-col space-y-6 duration-500'>
      <StudentPageHeader
        title='Người liên quan & Vấn đề'
        description='Quản lý thông tin các bên liên quan và các vấn đề phát sinh trong dự án'
      />

      <div className='bg-muted/5 border-border flex w-fit items-center gap-2 rounded-2xl border p-1.5'>
        <button
          onClick={() => setTab('stakeholder')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all ${
            tab === 'stakeholder'
              ? 'bg-surface text-primary shadow-sm'
              : 'text-muted hover:text-text hover:bg-surface/50'
          }`}
        >
          <UserOutlined className={tab === 'stakeholder' ? 'text-primary' : ''} />
          Người liên quan
        </button>

        <button
          onClick={() => setTab('issue')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all ${
            tab === 'issue'
              ? 'bg-surface text-primary shadow-sm'
              : 'text-muted hover:text-text hover:bg-surface/50'
          }`}
        >
          <WarningOutlined className={tab === 'issue' ? 'text-primary' : ''} />
          Vấn đề
        </button>
      </div>

      <div className='flex-1'>
        {tab === 'stakeholder' ? (
          <div className='animate-in slide-in-from-left-4 duration-500'>
            <StakeholderTab />
          </div>
        ) : (
          <div className='animate-in slide-in-from-right-4 duration-500'>
            <IssueTab />
          </div>
        )}
      </div>
    </section>
  );
}
