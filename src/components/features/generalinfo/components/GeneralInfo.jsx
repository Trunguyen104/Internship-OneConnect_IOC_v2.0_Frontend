'use client';

import { Descriptions, Typography, Spin, Empty } from 'antd';
import { useGeneralInfo } from '../hooks/useGeneralInfo';
import { GENERAL_INFO_UI } from '@/constants/general-info/general-info';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/Card';
import { PROJECT_UI } from '@/constants/project/uiText';

const { Text } = Typography;

export default function GeneralInfo({ internshipGroupId = null }) {
  const { info, loading } = useGeneralInfo(internshipGroupId);

  return (
    <section className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto duration-500'>
      <StudentPageHeader title='General Information' />

      <div className='flex min-h-0 flex-1 flex-col gap-6 lg:flex-row'>
        <div className='flex min-h-0 flex-1 flex-col lg:w-2/3'>
          <Card className='flex min-h-0 flex-1 flex-col'>
            {loading ? (
              <div className='flex flex-1 items-center justify-center py-20'>
                <Spin size='large' description='Loading information…' />
              </div>
            ) : !info ? (
              <div className='flex flex-1 items-center justify-center py-12'>
                <Empty
                  description={GENERAL_INFO_UI.MESSAGES.FETCH_ERROR || 'No information available'}
                />
              </div>
            ) : (
              <div className='w-full overflow-x-auto'>
                <Descriptions
                  column={{ xxl: 4, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
                  bordered={false}
                  styles={{
                    label: {
                      color: 'var(--color-muted)',
                      fontWeight: 600,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      paddingBottom: '8px',
                    },
                    content: {
                      color: 'var(--color-text)',
                      fontWeight: 700,
                      fontSize: '15px',
                      paddingBottom: '24px',
                    },
                  }}
                  layout='vertical'
                >
                  <Descriptions.Item label={GENERAL_INFO_UI.LABELS.GROUP_NAME}>
                    <Text
                      strong
                      className='block'
                      ellipsis={{ tooltip: info.groupName || GENERAL_INFO_UI.VALUES.NO_NAME }}
                    >
                      {info.groupName || GENERAL_INFO_UI.VALUES.NO_NAME}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={GENERAL_INFO_UI.LABELS.PROJECT}>
                    <Text
                      strong
                      className='block'
                      ellipsis={{ tooltip: info.project?.name || GENERAL_INFO_UI.VALUES.NA }}
                    >
                      {info.project?.name || GENERAL_INFO_UI.VALUES.NA}
                    </Text>
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
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
