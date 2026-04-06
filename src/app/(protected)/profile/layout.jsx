import { Layout } from 'antd';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { requireServerAuth } from '@/lib/server/auth-session';

const { Content } = Layout;

/**
 * ProfileLayout — accessible to all authenticated users (any role).
 * This layout includes the universal AppSidebar configured for the Profile context.
 */
export default async function ProfileLayout({ children }) {
  await requireServerAuth();

  return (
    <Layout className="flex h-screen">
      <AppSidebar />
      <Layout className="flex h-full flex-1 flex-col overflow-hidden">
        <Header />
        <Content className="flex flex-1 flex-col overflow-hidden bg-gray-50 p-4 2xl:p-6">
          <div className="flex w-full flex-1 flex-col overflow-hidden">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
