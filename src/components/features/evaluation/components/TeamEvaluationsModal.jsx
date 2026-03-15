'use client';

// import AppTable from '@/components/shared/AppTable';
import { Modal, Typography, Tag, Button, Tooltip, Space } from 'antd';
import { TeamOutlined, LockOutlined, EyeOutlined, ClockCircleFilled } from '@ant-design/icons';
import AppTable from '@/components/ui/AppTable';

import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

const { Text, Title } = Typography;

const getEvalStatusText = (evalStatus) => {
  const status = typeof evalStatus === 'string' ? evalStatus.toUpperCase() : evalStatus;

  switch (status) {
    case 0:
    case 'PENDING':
      return { label: EVALUATION_UI.STATUS.PENDING, color: 'default' };
    case 1:
    case 'DRAFT':
      return { label: EVALUATION_UI.STATUS.DRAFT, color: 'warning' };
    case 2:
    case 'SUBMITTED':
      return { label: EVALUATION_UI.STATUS.SUBMITTED, color: 'processing' };
    case 3:
    case 'PUBLISHED':
      return { label: EVALUATION_UI.STATUS.PUBLISHED, color: 'success' };
    default:
      return { label: evalStatus || EVALUATION_UI.STATUS.UNKNOWN, color: 'default' };
  }
};

export default function TeamEvaluationsModal({
  visible,
  cycle,
  onClose,
  onViewDetails,
  teamData,
  myStudentId,
}) {
  if (!cycle) return null;

  const columns = [
    {
      title: EVALUATION_UI.TABLE_COLUMNS.FULL_NAME,
      dataIndex: 'fullName',
      render: (text, record) => (
        <Text strong type={record.studentId === myStudentId ? 'danger' : undefined}>
          {text}
        </Text>
      ),
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.STUDENT_CODE,
      dataIndex: 'studentCode',
      render: (text) => (
        <Text type='secondary' code>
          {text}
        </Text>
      ),
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.STATUS,
      dataIndex: 'evaluationStatus',
      align: 'center',
      render: (status) => {
        const conf = getEvalStatusText(status);
        return <Tag color={conf.color}>{conf.label}</Tag>;
      },
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.SCORE,
      dataIndex: 'totalScore',
      align: 'center',
      render: (score, record) => {
        const status = record.evaluationStatus;
        const isPublished =
          status === 3 || (typeof status === 'string' && status.toUpperCase() === 'PUBLISHED');

        if (!isPublished) {
          return <Text type='secondary'>--</Text>;
        }

        if (record.studentId !== myStudentId) {
          return (
            <Tooltip title={EVALUATION_UI.LABELS.CONFIDENTIAL}>
              <Tag icon={<LockOutlined />}>***</Tag>
            </Tooltip>
          );
        }

        return <Tag color='red'>{Number(score).toFixed(1)}</Tag>;
      },
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.ACTIONS,
      align: 'right',
      render: (_, record) => {
        if (record.studentId !== myStudentId) return null;

        const status = record.evaluationStatus;
        const isPublished =
          status === 3 || (typeof status === 'string' && status.toUpperCase() === 'PUBLISHED');

        if (!isPublished) {
          return (
            <Tooltip title={EVALUATION_UI.LABELS.NOT_PUBLISHED}>
              <Button type='text' disabled icon={<ClockCircleFilled />}>
                {EVALUATION_UI.LABELS.AWAITING_RESULTS}
              </Button>
            </Tooltip>
          );
        }

        return (
          <Button
            type='primary'
            size='small'
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(cycle)}
            className='bg-primary'
          >
            {EVALUATION_UI.LABELS.VIEW_REPORT}
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined className='text-primary' />
          <Title level={4} style={{ margin: 0 }}>
            {EVALUATION_UI.MODAL_TEAM_TITLE}
          </Title>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={850}
      centered
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <AppTable columns={columns} data={teamData} pagination={false} rowKey='studentId' />
      </Space>
    </Modal>
  );
}
