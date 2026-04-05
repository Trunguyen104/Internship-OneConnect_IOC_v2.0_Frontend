'use client';

import { EyeOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tooltip, Typography } from 'antd';

import AppTable from '@/components/ui/apptable';
import StatusBadge from '@/components/ui/status-badge';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

const { Text, Title } = Typography;

const getEvalStatusText = (evalStatus) => {
  const status = typeof evalStatus === 'string' ? evalStatus.toUpperCase() : evalStatus;

  switch (status) {
    case 1:
    case 'PENDING':
      return { label: EVALUATION_UI.STATUS.PENDING, variant: 'neutral' };
    case 2:
    case 'DRAFT':
      return { label: EVALUATION_UI.STATUS.DRAFT, variant: 'warning' };
    case 3:
    case 'SUBMITTED':
      return { label: EVALUATION_UI.STATUS.SUBMITTED, variant: 'info' };
    case 4:
    case 'PUBLISHED':
      return { label: EVALUATION_UI.STATUS.PUBLISHED, variant: 'success' };
    default:
      return { label: evalStatus || EVALUATION_UI.STATUS.UNKNOWN, variant: 'neutral' };
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
      render: (text, record) => {
        const isMe =
          record.studentId?.toLowerCase() === myStudentId?.toLowerCase() ||
          record.studentId === myStudentId;

        return (
          <Text strong type={isMe ? 'danger' : undefined}>
            {text}
          </Text>
        );
      },
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.STUDENT_CODE,
      dataIndex: 'studentCode',
      render: (text) => (
        <Text type="secondary" code>
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
        return <StatusBadge variant={conf.variant} label={conf.label} />;
      },
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.SCORE,
      dataIndex: 'totalScore',
      align: 'center',
      render: (score, record) => {
        const isMe =
          record.studentId?.toLowerCase() === myStudentId?.toLowerCase() ||
          record.studentId === myStudentId;

        const status = record.status || record.evaluationStatus;
        const isPublished =
          status === 4 || (typeof status === 'string' && status.toUpperCase() === 'PUBLISHED');

        if (!isPublished) {
          return <Text type="secondary">--</Text>;
        }

        if (!isMe) {
          return (
            <Tooltip title={EVALUATION_UI.LABELS.CONFIDENTIAL}>
              <div className="flex justify-center">
                <span className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                  <LockOutlined className="text-[10px]" />
                  ***
                </span>
              </div>
            </Tooltip>
          );
        }

        return (
          <div className="flex justify-center">
            <span className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-0.5 text-[11px] font-black text-rose-600 shadow-sm">
              {Number(score).toFixed(1)}
            </span>
          </div>
        );
      },
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.ACTIONS,
      align: 'right',
      render: (_, record) => {
        const isMe =
          record.studentId?.toLowerCase() === myStudentId?.toLowerCase() ||
          record.studentId === myStudentId;

        if (!isMe) return null;

        return (
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(cycle)}
            className="bg-primary/95 hover:!bg-primary border-none shadow-sm transition-all"
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
          <TeamOutlined className="text-primary" />
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
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <AppTable columns={columns} data={teamData} pagination={false} rowKey="studentId" />
      </Space>
    </Modal>
  );
}
