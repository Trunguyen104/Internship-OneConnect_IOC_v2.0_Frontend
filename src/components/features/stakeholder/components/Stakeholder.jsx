'use client';

import { useState } from 'react';
import StakeholderTab from './StakeholderTab';
import IssueTab from './IssueTab';

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder');

  return (
    <section className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setTab('stakeholder')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border ${
            tab === 'stakeholder'
              ? 'border-primary bg-red-50 text-primary'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Stakeholder
        </button>

        <button
          onClick={() => setTab('issue')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border ${
            tab === 'issue'
              ? 'border-primary bg-red-50 text-primary'
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

