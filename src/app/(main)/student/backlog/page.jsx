'use client';

import PageShell from '@/components/layout/PageShell';
import StudentTabs from '@/components/layout/StudentTabs';
import BacklogBoard from '@/features/backlog/components/BacklogBoard';

export default function BacklogBoardPage() {
  return (
    <PageShell>
      <div className='flex items-center gap-4 mb-4'>
        <div className='flex-1 min-w-0'>
          <StudentTabs />
        </div>
      </div>
      <BacklogBoard />
    </PageShell>
  );
}

