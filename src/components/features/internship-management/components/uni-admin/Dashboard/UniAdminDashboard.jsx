'use client';

import React from 'react';
import { Row, Col, Typography } from 'antd';
import { TeamOutlined, CalendarOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useUniAdminDashboard } from './hooks/useUniAdminDashboard';
import MetricCard from './components/MetricCard';
import RecentTerms from './components/RecentTerms';

import Card from '@/components/ui/Card';
import StudentPageHeader from '@/components/layout/StudentPageHeader';

const { Text } = Typography;

export default function UniAdminDashboard() {
  const { loading, profile, stats, recentTerms } = useUniAdminDashboard();

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700'>
      <StudentPageHeader title='Dashboard' />

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={8}>
          <MetricCard
            title='Total Students'
            value={stats.totalStudents}
            icon={<TeamOutlined />}
            color='#3B82F6'
            loading={loading}
            suffix='Enrolled'
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <MetricCard
            title='Active Terms'
            value={stats.activeTerms}
            icon={<CalendarOutlined />}
            color='#10B981'
            loading={loading}
            suffix='In Progress'
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <MetricCard
            title='Internship Groups'
            value={stats.totalGroups}
            icon={<AppstoreOutlined />}
            color='#F59E0B'
            loading={loading}
            suffix='Coordinated'
          />
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card className='flex-1 !p-6 sm:!p-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div className='space-y-1'>
            <Text className='text-sm font-medium text-slate-500'>
              Here&apos;s a summary of the latest internship terms at{' '}
              <span className='text-primary font-bold'>
                {profile?.universityName || profile?.university?.name || 'your university'}
              </span>
            </Text>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-slate-50/30 p-4'>
          <RecentTerms data={recentTerms} loading={loading} />
        </div>
      </Card>
    </div>
  );
}
