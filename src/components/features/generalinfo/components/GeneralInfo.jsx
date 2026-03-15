'use client';

import React from 'react';
import { Card, Descriptions, Typography, Spin } from 'antd';
import { useGeneralInfo } from '../hooks/useGeneralInfo';
import StudentPageHeader from '@/components/layout/StudentPageHeader';

const { Text } = Typography;

export default function GeneralInfo() {
  const { info, loading } = useGeneralInfo();

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center rounded-2xl bg-white/50 backdrop-blur-sm'>
        <Spin size='large' description='Loading information...'>
          <div className='px-12' />
        </Spin>
      </div>
    );
  }

  return (
    <section className='animate-in fade-in flex min-h-0 flex-col space-y-6 duration-500'>
      <StudentPageHeader title='General Information' />

      <Card
        className='overflow-hidden rounded-2xl border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
        styles={{ body: { padding: '32px' } }}
      >
        <Descriptions
          column={{ xxl: 4, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          bordered={false}
          styles={{
            label: {
              color: '#64748b',
              fontWeight: 600,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.025em',
              paddingBottom: '8px',
            },
            content: {
              color: '#1e293b',
              fontWeight: 700,
              fontSize: '15px',
              paddingBottom: '20px',
            },
          }}
          layout='vertical'
        >
          <Descriptions.Item label='Group Code'>
            <Text copyable={{ text: info.groupCode || info.internshipId }}>
              {info.groupCode || info.internshipId || 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label='Group Name'>{info.groupName || 'No name'}</Descriptions.Item>
          <Descriptions.Item label='Internship Term'>
            {info.internshipTermName || info.internshipTerm || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Enterprise'>
            {info.enterpriseName || info.company || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='University'>
            {info.schoolName || info.school || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Mentor'>
            {info.mentorName || info.mentor || (
              <Text type='secondary' italic>
                Unassigned
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Start Date'>
            {info.startDate ? new Date(info.startDate).toLocaleDateString('en-GB') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='End Date'>
            {info.endDate ? new Date(info.endDate).toLocaleDateString('en-GB') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Student Count'>
            <Text className='text-primary text-2xl font-black'>
              {info.totalStudents || info.members?.length || 0}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label='Mentor Count'>
            <Text className='text-2xl font-black text-slate-700'>
              {info.totalMentors || (info.mentorName ? 1 : 0)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
}
