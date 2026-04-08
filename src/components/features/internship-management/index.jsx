'use client';

import { SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import InternshipManagement from '../internship-student-management/components';
import GroupManagement from './internship-group-management/components';

export default function InternshipManagementContainer({ phaseId, hideLayout = false }) {
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const searchParams = useSearchParams();
  const urlGroupId = searchParams?.get('groupId');
  const [tab, setTab] = useState(urlGroupId ? 'groups' : 'students');
  const [isDetail, setIsDetail] = useState(false);

  const content = (
    <>
      <div
        className={`bg-muted/5 border-border mb-6 flex w-fit items-center gap-2 rounded-2xl p-1 shrink-0 ${isDetail ? 'opacity-100 pointer-events-none' : ''}`}
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

      <div className={`flex flex-col ${!isDetail ? 'flex-1 min-h-0' : 'flex-none h-auto'}`}>
        {tab === 'students' ? (
          <div className="animate-in slide-in-from-left-4 flex flex-1 flex-col min-h-0 duration-500">
            <InternshipManagement phaseId={phaseId} />
          </div>
        ) : (
          <div
            className={`animate-in slide-in-from-right-4 flex flex-col duration-500 ${!isDetail ? 'flex-1 min-h-0' : 'flex-none h-auto'}`}
          >
            <GroupManagement onDetailMode={setIsDetail} phaseId={phaseId} />
          </div>
        )}
      </div>
    </>
  );

  if (hideLayout) {
    return (
      <div className={`flex flex-col ${!isDetail ? 'h-full flex-1' : 'h-auto'}`}>{content}</div>
    );
  }

  return (
    <PageLayout
      className={`animate-in fade-in flex flex-col space-y-6 duration-500 ${!isDetail ? 'h-full flex-1 min-h-0' : 'h-auto flex-none'}`}
    >
      <PageLayout.Card
        className={`flex flex-col !p-4 sm:!p-8 ${
          !isDetail
            ? 'h-full flex-1 overflow-hidden min-h-[500px] max-h-[calc(100vh-160px)]'
            : 'h-auto flex-none overflow-visible'
        }`}
      >
        {content}
      </PageLayout.Card>
    </PageLayout>
  );
}
