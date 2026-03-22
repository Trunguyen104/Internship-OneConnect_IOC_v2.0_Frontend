'use client';

import React, { useState } from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

import IssueTab from './IssueTab';
import StakeholderTab from './StakeholderTab';

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder');

  return (
    <section className="animate-in fade-in mt-[-9px] flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader hidden />
      <div className="bg-muted/5 border-border flex w-fit items-center gap-2 rounded-2xl">
        <button
          onClick={() => setTab('stakeholder')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all ${
            tab === 'stakeholder'
              ? 'bg-surface text-primary shadow-sm'
              : 'text-muted hover:text-text hover:bg-surface/50'
          }`}
        >
          {STAKEHOLDER_UI.TAB_STAKEHOLDER}
        </button>

        <button
          onClick={() => setTab('issue')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all ${
            tab === 'issue'
              ? 'bg-surface text-primary shadow-sm'
              : 'text-muted hover:text-text hover:bg-surface/50'
          }`}
        >
          {STAKEHOLDER_UI.TAB_ISSUE}
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        {tab === 'stakeholder' ? (
          <div className="animate-in slide-in-from-left-4 flex flex-1 flex-col duration-500">
            <StakeholderTab />
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
            <IssueTab />
          </div>
        )}
      </div>
    </section>
  );
}
