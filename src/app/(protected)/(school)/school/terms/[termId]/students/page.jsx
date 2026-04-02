import UserManagementPage from '@/components/features/user-management/UserManagementPage';
import { UI_TEXT } from '@/lib/UI_Text';

export const metadata = { title: 'Students | Term Workspace' };

export default function TermStudentsPage() {
  return <UserManagementPage title={UI_TEXT.USER_MANAGEMENT.STUDENT_TITLE} />;
}
