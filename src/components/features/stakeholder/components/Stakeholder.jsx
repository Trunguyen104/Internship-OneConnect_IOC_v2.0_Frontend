'use client';

import { useState } from 'react';
import StakeholderTab from './StakeholderTab';
import IssueTab from './IssueTab';
import StudentPageHeader from '@/components/layout/StudentPageHeader';

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder');

  return (
    <section className='space-y-6'>
      <StudentPageHeader hidden />
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setTab('stakeholder')}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
            tab === 'stakeholder'
              ? 'border-primary text-primary bg-red-50'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Stakeholder
        </button>

        <button
          onClick={() => setTab('issue')}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
            tab === 'issue'
              ? 'border-primary text-primary bg-red-50'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Issue
        </button>
      </div>

      {tab === 'stakeholder' && <StakeholderTab />}
      {tab === 'issue' && <IssueTab />}
    </section>
  );
}
