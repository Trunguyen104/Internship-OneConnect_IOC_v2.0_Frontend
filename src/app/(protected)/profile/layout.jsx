'use client';

import { Layout } from 'antd';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import AuthGuard from '@/components/shared/AuthGuard';

const { Content } = Layout;

/**
 * ProfileLayout — accessible to all authenticated users (any role).
 * This layout includes the universal AppSidebar configured for the Profile context.
 */
export default function ProfileLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[]}>
      <Layout className="flex min-h-screen">
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
