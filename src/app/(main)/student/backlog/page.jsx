'use client';

import PageShell from '@/shared/components/PageShell';
import StudentTabs from '@/shared/components/StudentTabs';
import BacklogBoard from '@/feature/student/BacklogBoard';

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
