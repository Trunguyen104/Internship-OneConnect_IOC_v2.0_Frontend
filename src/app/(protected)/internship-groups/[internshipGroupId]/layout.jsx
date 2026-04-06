import { Layout } from 'antd';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { USER_ROLE } from '@/constants/user-management/enums';
import { requireServerAuth } from '@/lib/server/auth-session';

const { Content } = Layout;

const ALLOWED_ROLES = [USER_ROLE.STUDENT, USER_ROLE.HR, USER_ROLE.MENTOR];

/**
 * Internship group workspace — aligned with SuperAdmin shell:
 * AppSidebar (Ant Sider + Menu) + Header + Content (bg-gray-50, same padding as /admin).
 */
export default async function InternshipGroupLayout({ children }) {
  await requireServerAuth(ALLOWED_ROLES);

  return (
    <Layout className="h-screen overflow-hidden">
      <AppSidebar />
      <Layout className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <Content className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-4 2xl:p-6">
          <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
