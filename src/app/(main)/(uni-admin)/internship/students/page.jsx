import React from 'react';

import StudentActivityList from '@/components/features/internship-student-activity/components/StudentActivityList';

export const metadata = {
  title: 'Danh sách sinh viên thực tập | Uni Admin',
  description: 'Xem tổng quan và chi tiết hoạt động thực tập của từng sinh viên thuộc trường.',
};

export const dynamic = 'force-dynamic';

export default function StudentActivityListPage() {
  return <StudentActivityList />;
}
