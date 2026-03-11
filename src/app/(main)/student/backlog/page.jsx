'use client';

import PageShell from '@/components/shared/PageShell';
import StudentTabs from '@/components/shared/StudentTabs';
import BacklogBoard from '@/components/feature/student/backlog-board/BacklogBoard';

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
