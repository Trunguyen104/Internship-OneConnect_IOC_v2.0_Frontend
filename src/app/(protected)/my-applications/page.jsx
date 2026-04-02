'use client';

import StudentApplicationList from '@/components/features/student-applications/components/StudentApplicationList';
import { STUDENT_APPLICATIONS_UI } from '@/components/features/student-applications/constants/uiText';
import StudentTopNav from '@/components/layout/StudentTopNav';
import AuthGuard from '@/components/shared/AuthGuard';
import { USER_ROLE } from '@/constants/user-management/enums';

export default function MyApplicationsPage() {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.STUDENT]}>
      <div className="flex h-screen flex-col overflow-hidden">
        <StudentTopNav />
        <main className="flex-1 overflow-auto bg-slate-50/50 p-4 lg:p-8 2xl:p-12">
          <div className="mx-auto max-w-7xl">
            <header className="mb-10 text-center sm:text-left">
              <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-5xl">
                {STUDENT_APPLICATIONS_UI.TITLE}
              </h1>
              <p className="mt-3 text-sm font-medium text-slate-500 sm:text-lg">
                {STUDENT_APPLICATIONS_UI.SUBTITLE}
              </p>
            </header>

            <StudentApplicationList />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
