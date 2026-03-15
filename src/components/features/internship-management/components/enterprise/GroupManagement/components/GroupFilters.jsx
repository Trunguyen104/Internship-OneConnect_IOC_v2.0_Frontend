'use client';

import React from 'react';
import { Input, Segmented, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';

export function GroupFilters({ activeTab, onTabChange, search, onSearchChange, groupCount }) {
  const { ALL_GROUPS, ACTIVE, ARCHIVED, SEARCH_PLACEHOLDER } =
    INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT;

  return (
    <div className='mb-6 flex flex-col items-center justify-between gap-4 md:flex-row'>
      <Segmented
        value={activeTab}
        onChange={onTabChange}
        options={[
          { label: `${ALL_GROUPS} (${groupCount})`, value: 'ALL' },
          { label: ACTIVE, value: 'ACTIVE' },
          { label: ARCHIVED, value: 'ARCHIVED' },
        ]}
        className='bg-muted/30 rounded-xl p-1 font-semibold'
      />

      <Input
        placeholder={SEARCH_PLACEHOLDER}
        prefix={<SearchOutlined className='text-muted ml-1' />}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className='bg-surface border-border hover:border-primary focus:border-primary h-11 w-full rounded-xl transition-all md:w-80'
      />
    </div>
  );
}
