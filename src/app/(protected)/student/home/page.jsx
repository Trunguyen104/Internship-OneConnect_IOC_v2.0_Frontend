'use client';

import InternshipDashboard from '@/components/features/internship/InternshipDashboard';
import StudentTopNav from '@/components/layout/StudentTopNav';

export default function StudentHomePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <StudentTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <InternshipDashboard />
      </main>
    </div>
  );
}
