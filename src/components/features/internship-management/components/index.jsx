'use client';

import { SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import GroupManagement from '../../internship-group-management/components';
import InternshipManagement from '../../internship-student-management/components';

export default function InternshipManagementContainer() {
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const [tab, setTab] = useState('students');

  return (
    <section className="animate-in fade-in mt-[-15px] flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <div className="bg-muted/5 border-border flex w-fit items-center gap-2 rounded-2xl p-1">
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

      <div className="flex flex-1 flex-col">
        {tab === 'students' ? (
          <div className="animate-in slide-in-from-left-4 flex flex-1 flex-col duration-500">
            <InternshipManagement />
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
            <GroupManagement />
          </div>
        )}
      </div>
    </section>
  );
}
