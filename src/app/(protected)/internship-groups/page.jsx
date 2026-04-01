'use client';

import { Layout } from 'antd';

import InternshipDashboard from '@/components/features/internship/InternshipDashboard';
import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';

const { Content } = Layout;

/**
 * Groups list — same shell as /admin and /internship-groups/[id]/* (AppSidebar + Header).
 */
export default function InternshipGroupsPage() {
  return (
    <Layout className="min-h-screen">
      <AppSidebar />
      <Layout className="flex min-h-screen flex-1 flex-col">
        <Header />
        <Content className="flex flex-1 flex-col overflow-y-auto bg-gray-50 p-4 2xl:p-6">
          <InternshipDashboard />
        </Content>
      </Layout>
    </Layout>
  );
}
