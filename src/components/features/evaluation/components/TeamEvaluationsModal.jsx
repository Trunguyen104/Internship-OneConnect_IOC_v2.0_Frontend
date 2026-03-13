'use client';

// import AppTable from '@/components/shared/AppTable';
import { Modal, Typography, Tag, Button, Tooltip, Space } from 'antd';
import { TeamOutlined, LockOutlined, EyeOutlined, ClockCircleFilled } from '@ant-design/icons';
import AppTable from '@/components/ui/AppTable';

const { Text, Title } = Typography;

const getEvalStatusText = (evalStatus) => {
  const status = typeof evalStatus === 'string' ? evalStatus.toUpperCase() : evalStatus;

  switch (status) {
    case 0:
    case 'PENDING':
      return { label: 'Pending', color: 'default' };
    case 1:
    case 'DRAFT':
      return { label: 'Draft', color: 'warning' };
    case 2:
    case 'SUBMITTED':
      return { label: 'Submitted', color: 'processing' };
    case 3:
    case 'PUBLISHED':
      return { label: 'Published', color: 'success' };
    default:
      return { label: evalStatus || 'N/A', color: 'default' };
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
      title: 'Họ và Tên',
      dataIndex: 'fullName',
      render: (text, record) => (
        <Text strong type={record.studentId === myStudentId ? 'danger' : undefined}>
          {text}
        </Text>
      ),
    },
    {
      title: 'MSSV',
      dataIndex: 'studentCode',
      render: (text) => (
        <Text type='secondary' code>
          {text}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'evaluationStatus',
      align: 'center',
      render: (status) => {
        const conf = getEvalStatusText(status);
        return <Tag color={conf.color}>{conf.label}</Tag>;
      },
    },
    {
      title: 'Điểm số',
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
            <Tooltip title='Điểm số được bảo mật'>
              <Tag icon={<LockOutlined />}>***</Tag>
            </Tooltip>
          );
        }

        return <Tag color='red'>{Number(score).toFixed(1)}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      align: 'right',
      render: (_, record) => {
        if (record.studentId !== myStudentId) return null;

        const status = record.evaluationStatus;
        const isPublished =
          status === 3 || (typeof status === 'string' && status.toUpperCase() === 'PUBLISHED');

        if (!isPublished) {
          return (
            <Tooltip title='Phiếu điểm chưa được công bố'>
              <Button type='text' disabled icon={<ClockCircleFilled />}>
                Chờ kết quả
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
          >
            Xem Phiếu
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Tiến độ Đánh giá Nhóm
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
