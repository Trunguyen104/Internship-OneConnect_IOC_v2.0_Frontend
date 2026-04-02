'use client';

import { SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import GroupManagement from '../internship-group-management/components';
import InternshipManagement from '../internship-student-management/components';

export default function InternshipManagementContainer() {
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const searchParams = useSearchParams();
  const urlGroupId = searchParams?.get('groupId');
  const [tab, setTab] = useState(urlGroupId ? 'groups' : 'students');
  const [isDetail, setIsDetail] = useState(false);

  return (
    <section
      className={`animate-in fade-in mt-[-15px] flex flex-1 flex-col space-y-6 duration-500 ${!isDetail ? 'min-h-0' : ''}`}
    >
      <div
        className={`bg-muted/5 border-border flex w-fit items-center gap-2 rounded-2xl p-1 shrink-0 ${isDetail ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <button
          onClick={() => setTab('students')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all ${
            tab === 'students'
              ? 'bg-surface text-primary shadow-sm'
              : 'text-muted hover:text-text hover:bg-surface/50'
          }`}
        >
          <SolutionOutlined className="text-lg" />
          {GROUP_MANAGEMENT.TABS.STUDENTS}
        </button>

        <button
          onClick={() => setTab('groups')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all ${
            tab === 'groups'
              ? 'bg-surface text-primary shadow-sm'
              : 'text-muted hover:text-text hover:bg-surface/50'
          }`}
        >
          <TeamOutlined className="text-lg" />
          {GROUP_MANAGEMENT.TABS.GROUPS}
        </button>
      </div>

      <div className={`flex flex-1 flex-col ${!isDetail ? 'min-h-0' : ''}`}>
        {tab === 'students' ? (
          <div className="animate-in slide-in-from-left-4 flex flex-1 flex-col min-h-0 duration-500">
            <InternshipManagement />
          </div>
        ) : (
          <div
            className={`animate-in slide-in-from-right-4 flex flex-1 flex-col duration-500 ${!isDetail ? 'min-h-0' : ''}`}
          >
            <GroupManagement onDetailMode={setIsDetail} />
          </div>
        )}
      </div>
    </section>
  );
}
