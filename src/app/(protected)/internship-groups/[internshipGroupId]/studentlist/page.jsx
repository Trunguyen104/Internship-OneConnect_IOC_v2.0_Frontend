import StudentListPage from '@/components/features/studentlist/components/StudentListPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student List | IOCv2',
  description: 'View and manage members in your internship group.',
};

export default function Page() {
  return <StudentListPage />;
}
