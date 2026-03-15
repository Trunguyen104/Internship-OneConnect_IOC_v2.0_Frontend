'use client';

import { Drawer, Empty, Typography, Progress, Card, Descriptions, Space, Divider } from 'antd';
import { MessageOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

const { Text, Paragraph, Title } = Typography;

export default function ScoreDetailDrawer({ visible, cycle, onClose, evaluationDetail }) {
  if (!cycle) return null;

  return (
    <Drawer
      title={<Text className='text-text text-lg font-bold'>{cycle.name}</Text>}
      placement='right'
      size='large'
      onClose={onClose}
      open={visible}
    >
      {!evaluationDetail ? (
        <Empty description={EVALUATION_UI.LABELS.SCORECARD_NOT_READY} />
      ) : (
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Card className='border-border/60 shadow-sm'>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label={EVALUATION_UI.LABELS.EVALUATOR}>
                <Text strong className='text-text'>
                  {evaluationDetail.evaluatorName}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label={EVALUATION_UI.LABELS.TIME}>
                <Text className='text-muted-foreground text-xs'>
                  {dayjs(evaluationDetail.gradedAt).format('DD/MM/YYYY HH:mm')}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label={EVALUATION_UI.LABELS.TOTAL_SCORE}>
                <div className='flex items-baseline gap-1'>
                  <span className='text-primary text-3xl font-black'>
                    {Number(evaluationDetail.totalScore).toFixed(1)}
                  </span>
                  <Text type='secondary' className='text-sm'>
                    / 10
                  </Text>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            className='border-border/60 shadow-sm'
            title={
              <Space className='text-primary'>
                <MessageOutlined />
                {EVALUATION_UI.LABELS.MENTOR_COMMENTS}
              </Space>
            }
          >
            <Paragraph italic className='text-text/80 mt-2'>
              {evaluationDetail.generalComment || EVALUATION_UI.LABELS.NO_COMMENTS}
            </Paragraph>
          </Card>

          <Card
            className='border-border/60 shadow-sm'
            title={
              <Space className='text-primary'>
                <StarFilled />
                {EVALUATION_UI.LABELS.CRITERIA_SCORES}
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
