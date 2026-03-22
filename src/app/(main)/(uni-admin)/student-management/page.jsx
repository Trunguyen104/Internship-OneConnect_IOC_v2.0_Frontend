import UserManagementPage from '@/components/features/user-management/UserManagementPage';
import { UI_TEXT } from '@/lib/UI_Text';

export const metadata = {
  title: 'Student Management',
  description: 'Manage student accounts for your university.',
};

export default function Page() {
  return <UserManagementPage title={UI_TEXT.USER_MANAGEMENT.STUDENT_TITLE} />;
}
