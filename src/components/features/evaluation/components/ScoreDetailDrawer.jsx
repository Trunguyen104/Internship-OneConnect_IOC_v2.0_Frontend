'use client';

import { Drawer, Empty, Typography, Progress, Card, Descriptions, Space, Divider } from 'antd';
import { MessageOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph, Title } = Typography;

export default function ScoreDetailDrawer({ visible, cycle, onClose, evaluationDetail }) {
  if (!cycle) return null;

  return (
    <Drawer title={cycle.name} placement='right' size='large' onClose={onClose} open={visible}>
      {!evaluationDetail ? (
        <Empty description='Scorecard not ready' />
      ) : (
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Card>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Evaluator'>
                {evaluationDetail.evaluatorName}
              </Descriptions.Item>

              <Descriptions.Item label='Time'>
                {dayjs(evaluationDetail.gradedAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>

              <Descriptions.Item label='Total Score'>
                <Title level={2} style={{ margin: 0 }}>
                  {Number(evaluationDetail.totalScore).toFixed(1)}
                  <Text type='secondary'> / 10</Text>
                </Title>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title={
              <Space>
                <MessageOutlined />
                Mentor Comments
              </Space>
            }
          >
            <Paragraph italic>
              {evaluationDetail.generalComment || 'No comments provided'}
            </Paragraph>
          </Card>

          <Card
            title={
              <Space>
                <StarFilled />
                Criteria Scores
              </Space>
            }
          >
            <div className='flex flex-col gap-4'>
              {evaluationDetail.criteriaScores?.map((criteria, index) => {
                const percent = (criteria.score / criteria.maxScore) * 100;

                return (
                  <div key={index} className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <Text strong>{criteria.criteriaName}</Text>
                      <Text>
                        {criteria.score} / {criteria.maxScore}
                      </Text>
                    </div>

                    <Progress percent={percent} showInfo={false} />

                    <Text type='secondary' italic>
                      {criteria.comment || 'No detailed comments provided'}
                    </Text>

                    {index < evaluationDetail.criteriaScores.length - 1 && (
                      <Divider style={{ margin: '8px 0' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </Space>
      )}
    </Drawer>
  );
}
