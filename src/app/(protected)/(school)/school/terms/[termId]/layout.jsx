'use client';

import { Layout } from 'antd';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';

const { Content } = Layout;

/**
 * TermWorkspaceLayout
 * Sidebar + Header layout, rendered when a UniAdmin enters a specific Term.
 * AppSidebar auto-detects /school/terms/[termId]/* and shows term menu.
 */
export default function TermWorkspaceLayout({ children }) {
  return (
    <Layout className="h-full overflow-hidden">
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
