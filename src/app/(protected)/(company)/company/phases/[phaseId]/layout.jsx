'use client';

import { Layout } from 'antd';

import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';

const { Content } = Layout;

/**
 * PhaseWorkspaceLayout
 * Sidebar + Header layout, rendered when HR/Mentor/EntAdmin enters a specific Phase.
 * AppSidebar auto-detects /company/phases/[phaseId]/* and shows phase menu.
 */
export default function PhaseWorkspaceLayout({ children }) {
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
