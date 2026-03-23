import UserManagementPage from '@/components/features/user-management/UserManagementPage';
import { UI_TEXT } from '@/lib/UI_Text';

export const metadata = {
  title: 'Staff Management',
  description: 'Manage HR and Mentor accounts for your enterprise.',
};

export default function Page() {
  return <UserManagementPage title={UI_TEXT.USER_MANAGEMENT.STAFF_TITLE} />;
}
