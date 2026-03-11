'use client';

// import AppTable from '@/components/shared/AppTable';
import { Modal, Typography, Tag, Button, Tooltip, Alert, Space } from 'antd';
import {
  TeamOutlined,
  LockOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  ClockCircleFilled,
} from '@ant-design/icons';
import AppTable from '@/components/ui/AppTable';

const { Text, Title } = Typography;

const getEvalStatusText = (evalStatus) => {
  switch (evalStatus) {
    case 0:
      return { label: 'Chưa đánh giá', color: 'default' };
    case 1:
      return { label: 'Bản nháp', color: 'warning' };
    case 2:
      return { label: 'Đã gửi (Chờ duyệt)', color: 'processing' };
    case 3:
      return { label: 'Đã công bố', color: 'success' };
    default:
      return { label: 'N/A', color: 'default' };
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
        if (record.evaluationStatus < 3) {
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

        if (record.evaluationStatus < 3) {
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

        <Alert
          icon={<ExclamationCircleFilled />}
          type='info'
          showIcon
          message='Bảo mật điểm số'
          description="Vì lý do bảo mật, điểm số của các thành viên khác trong nhóm sẽ được ẩn (***). Bạn chỉ có thể xem chi tiết phiếu điểm của chính mình khi trạng thái là 'Đã công bố'."
        />
      </Space>
    </Modal>
  );
}
