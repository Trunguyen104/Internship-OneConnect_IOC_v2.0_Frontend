'use client';

import PageShell from '@/components/layout/PageShell';
import StudentTabs from '@/components/layout/StudentTabs';
import BacklogBoard from '@/components/features/backlog/components/BacklogBoard';

export default function BacklogBoardPage() {
  return (
    <PageShell>
      <div className='mb-4 flex items-center gap-4'>
        <div className='min-w-0 flex-1'>
          <StudentTabs />
        </div>
      </div>
      <BacklogBoard />
    </PageShell>
  );
}
