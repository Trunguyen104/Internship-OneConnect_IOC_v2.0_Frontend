'use client';

import React from 'react';
import { Card, Descriptions, Typography, Spin } from 'antd';
import { useGeneralInfo } from '../hooks/useGeneralInfo';

const { Text } = Typography;

export default function GeneralInfo() {
  const { info, loading } = useGeneralInfo();

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center rounded-2xl bg-white/50 backdrop-blur-sm'>
        <Spin size='large' tip='Đang tải thông tin...' />
      </div>
    );
  }

  // const status = getStatusConfig(info.status);

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-7xl space-y-6 duration-700'>
      <h1 className='text-2xl font-bold text-slate-900'> Thông tin chung </h1>

      <Card
        className='overflow-hidden rounded-2xl border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
        bodyStyle={{ padding: '32px' }}
      >
        <Descriptions
          title={
            <div className='mb-6 flex items-center gap-3'>
              <div className='bg-primary h-6 w-1.5 rounded-full shadow-[0_0_10px_rgba(213,32,32,0.3)]'></div>
              <Text strong className='text-lg text-slate-800'>
                Chi tiết nhóm thực tập
              </Text>
            </div>
          }
          column={{ xxl: 4, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          bordered={false}
          labelStyle={{
            color: '#64748b',
            fontWeight: 600,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
            paddingBottom: '8px',
          }}
          contentStyle={{
            color: '#1e293b',
            fontWeight: 700,
            fontSize: '15px',
            paddingBottom: '20px',
          }}
          layout='vertical'
        >
          <Descriptions.Item label='Mã nhóm'>
            <Text copyable={{ text: info.groupCode || info.internshipId }}>
              {info.groupCode || info.internshipId || 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label='Tên nhóm'>{info.groupName || 'Chưa đặt tên'}</Descriptions.Item>
          <Descriptions.Item label='Kỳ thực tập'>
            {info.internshipTermName || info.internshipTerm || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Doanh nghiệp'>
            {info.enterpriseName || info.company || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Trường'>
            {info.schoolName || info.school || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Mentor'>
            {info.mentorName || info.mentor || (
              <Text type='secondary' italic>
                Chưa phân công
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Ngày bắt đầu'>
            {info.startDate ? new Date(info.startDate).toLocaleDateString('en-GB') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Ngày kết thúc'>
            {info.endDate ? new Date(info.endDate).toLocaleDateString('en-GB') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='Số lượng sinh viên'>
            <Text className='text-primary text-2xl font-black'>
              {info.totalStudents || info.members?.length || 0}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label='Số lượng mentor'>
            <Text className='text-2xl font-black text-slate-700'>
              {info.totalMentors || (info.mentorName ? 1 : 0)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
