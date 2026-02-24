'use client';

import PageShell from '@/shared/components/PageShell';
import StudentTabs from '@/shared/components/StudentTabs';
import ProductBacklog from '@/feature/student/ProductBacklog';

export default function ProductBacklogPage() {
  return (
    <PageShell>
      <div className='flex items-center gap-4 mb-4'>
        <div className='flex-1 min-w-0'>
          <StudentTabs />
        </div>
      </div>

      <ProductBacklog />
    </PageShell>
  );
}
