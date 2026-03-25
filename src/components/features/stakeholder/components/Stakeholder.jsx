'use client';

import React, { useState } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

import IssueTab from './IssueTab';
import StakeholderTab from './StakeholderTab';

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder');

  return (
    <PageLayout>
      <PageLayout.Header title={STAKEHOLDER_UI.PAGE_TITLE} />

      <div className="mb-6 flex w-fit items-center gap-1 rounded-2xl bg-gray-100/50 p-1">
        <button
          onClick={() => setTab('stakeholder')}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
            tab === 'stakeholder'
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
          }`}
        >
          {STAKEHOLDER_UI.TAB_STAKEHOLDER}
        </button>

        <button
          onClick={() => setTab('issue')}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
            tab === 'issue'
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
          }`}
        >
          {STAKEHOLDER_UI.TAB_ISSUE}
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {tab === 'stakeholder' ? (
          <div className="animate-in slide-in-from-left-4 flex flex-1 flex-col overflow-hidden duration-500">
            <StakeholderTab />
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 flex flex-1 flex-col overflow-hidden duration-500">
            <IssueTab />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
