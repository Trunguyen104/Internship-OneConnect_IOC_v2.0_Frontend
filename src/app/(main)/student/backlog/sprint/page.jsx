'use client';

import PageShell from '@/shared/components/PageShell';
import StudentTabs from '@/shared/components/StudentTabs';
import SprintBacklog from '@/feature/student/SprintBacklog';

export default function SprintBacklogPage() {
  return (
    <PageShell>
      <div className='flex items-center gap-4 mb-4'>
        <div className='flex-1 min-w-0'>
          <StudentTabs />
        </div>
      </div>

      <SprintBacklog />
    </PageShell>
  );
}
