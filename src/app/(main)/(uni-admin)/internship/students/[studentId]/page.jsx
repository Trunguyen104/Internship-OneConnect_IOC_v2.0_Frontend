import React from 'react';

import StudentActivityDetail from '@/components/features/internship-student-activity/components/StudentActivityDetail';

export const metadata = {
  title: 'Chi tiết hoạt động thực tập sinh | Uni Admin',
  description: 'Theo dõi chi tiết hoạt động thực tập, logbook, đánh giá và vi phạm của sinh viên.',
};

export const dynamic = 'force-dynamic';

export default function StudentActivityDetailPage() {
  return <StudentActivityDetail />;
}
