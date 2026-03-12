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
          className='flex h-12 min-w-[180px] items-center gap-2 rounded-full border-none bg-gradient-to-r from-blue-600 to-indigo-600 px-8 font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95'
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
              className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-blue-600'}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Input
          placeholder='Search groups...'
          prefix={<SearchOutlined className='mr-2 text-blue-600' />}
          className='h-12 max-w-72 rounded-2xl border-slate-200 bg-white shadow-sm transition-all hover:border-blue-500 focus:border-blue-500'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </>
  );
}
