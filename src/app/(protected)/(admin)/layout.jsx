'use client';

import { Layout } from 'antd';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import AuthGuard from '@/components/shared/AuthGuard';
import { USER_ROLE } from '@/constants/user-management/enums';

const { Content } = Layout;

/**
 * AdminLayout — SuperAdmin + Moderator.
 * Pattern: AppSidebar (role-based menu) + Header + Content.
 */
export default function AdminLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.SUPER_ADMIN, USER_ROLE.MODERATOR]}>
      <Layout className="h-screen overflow-hidden">
        <AppSidebar />
        <Layout className="flex h-full flex-1 flex-col overflow-hidden">
          <Header />
          <Content className="flex flex-1 flex-col overflow-hidden bg-gray-50 p-4 2xl:p-6">
            <div className="flex w-full flex-1 flex-col overflow-hidden">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </AuthGuard>
  );
}
