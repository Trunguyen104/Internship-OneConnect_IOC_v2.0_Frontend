'use client';

import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

export function GroupFilters({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  onCreate,
  groupCount,
}) {
  return (
    <>
      <div className='mb-10 flex flex-wrap items-center justify-between gap-6'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>
            Internship Group Management
          </h1>
          <p className='font-medium text-slate-500'>
            Manage and organize internship teams with ease.
          </p>
        </div>
        <Button
          type='primary'
          size='large'
          icon={<PlusOutlined />}
          className='from-primary shadow-primary/25 flex h-12 min-w-[180px] items-center gap-2 rounded-full border-none bg-gradient-to-r to-orange-600 px-8 font-bold shadow-lg transition-all hover:scale-105 active:scale-95'
          onClick={onCreate}
        >
          Create New Group
        </Button>
      </div>

      <div className='mb-8 flex flex-col items-center justify-between gap-6 md:flex-row'>
        <div className='flex w-full rounded-2xl bg-slate-200/50 p-1.5 md:w-auto'>
          {[
            { id: 'ALL', label: `All Groups (${groupCount})` },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'ARCHIVED', label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'text-primary bg-white shadow-sm' : 'hover:text-primary text-slate-500'}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Input
          placeholder='Search groups...'
          prefix={<SearchOutlined className='text-primary mr-2' />}
          className='hover:border-primary focus:border-primary h-12 max-w-72 rounded-2xl border-slate-200 bg-white shadow-sm transition-all'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </>
  );
}
