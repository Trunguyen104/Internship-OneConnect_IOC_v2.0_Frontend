'use client';

import React from 'react';
import { Row, Col } from 'antd';
import { TeamOutlined, CalendarOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useUniAdminDashboard } from './hooks/useUniAdminDashboard';
import MetricCard from './components/MetricCard';
import RecentTerms from './components/RecentTerms';
import Card from '@/components/ui/Card';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

export default function UniAdminDashboard() {
  const { DASHBOARD } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { loading, stats, recentTerms } = useUniAdminDashboard();

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 flex h-full flex-col space-y-6 duration-700'>
      <StudentPageHeader title={DASHBOARD.TITLE} />

      {/* Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <MetricCard
            title={DASHBOARD.METRICS.TOTAL_STUDENTS}
            value={stats.totalStudents}
            icon={<TeamOutlined />}
            color='var(--color-info)'
            loading={loading}
            suffix={DASHBOARD.METRICS.ENROLLED}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <MetricCard
            title={DASHBOARD.METRICS.ACTIVE_TERMS}
            value={stats.activeTerms}
            icon={<CalendarOutlined />}
            color='var(--color-success)'
            loading={loading}
            suffix={DASHBOARD.METRICS.IN_PROGRESS}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <MetricCard
            title={DASHBOARD.METRICS.INTERNSHIP_GROUPS}
            value={stats.totalGroups}
            icon={<AppstoreOutlined />}
            color='var(--color-warning)'
            loading={loading}
            suffix={DASHBOARD.METRICS.COORDINATED}
          />
        </Col>
      </Row>

      <div className='flex-1 pb-4'>
        <Card className='flex flex-col overflow-hidden !p-4 sm:!p-8'>
          <RecentTerms data={recentTerms} loading={loading} />
        </Card>
      </div>
    </div>
  );
}
