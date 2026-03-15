'use client';

import { Card, Descriptions, Typography, Spin } from 'antd';
import { useGeneralInfo } from '../hooks/useGeneralInfo';
import { GENERAL_INFO_UI } from '@/constants/general-info/general-info';
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
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.GROUP_CODE}>
            <Text copyable={{ text: info.groupCode || info.internshipId }}>
              {info.groupCode || info.internshipId || GENERAL_INFO_UI.VALUES.NA}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.GROUP_NAME}>
            {info.groupName || GENERAL_INFO_UI.VALUES.NO_NAME}
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.INTERNSHIP_TERM}>
            {info.internshipTermName || info.internshipTerm || GENERAL_INFO_UI.VALUES.NA}
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.ENTERPRISE}>
            {info.enterpriseName || info.company || GENERAL_INFO_UI.VALUES.NA}
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.UNIVERSITY}>
            {info.schoolName || info.school || GENERAL_INFO_UI.VALUES.NA}
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.MENTOR}>
            {info.mentorName || info.mentor || (
              <Text type='secondary' italic>
                {GENERAL_INFO_UI.VALUES.UNASSIGNED}
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.START_DATE}>
            {info.startDate
              ? new Date(info.startDate).toLocaleDateString('vi-VN')
              : GENERAL_INFO_UI.VALUES.NA}
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.END_DATE}>
            {info.endDate
              ? new Date(info.endDate).toLocaleDateString('vi-VN')
              : GENERAL_INFO_UI.VALUES.NA}
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.STUDENT_COUNT}>
            <Text className='text-primary text-2xl font-black'>
              {info.totalStudents || info.members?.length || 0}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={GENERAL_INFO_UI.LABELS.MENTOR_COUNT}>
            <Text className='text-text text-2xl font-black'>
              {info.totalMentors || (info.mentorName ? 1 : 0)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
}
