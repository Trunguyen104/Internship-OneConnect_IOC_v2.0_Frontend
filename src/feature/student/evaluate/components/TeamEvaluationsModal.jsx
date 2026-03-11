'use client';

import AppTable from '@/shared/components/AppTable';
import React from 'react';
import { Modal, Typography, Tag, Button, Tooltip } from 'antd';
import {
  TeamOutlined,
  LockOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  ClockCircleFilled,
} from '@ant-design/icons';

const { Text } = Typography;

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
      key: 'fullName',
      render: (text, record) => (
        <span
          className={`font-semibold ${record.studentId === myStudentId ? 'text-[#d52020]' : 'text-slate-700'}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'MSSV',
      dataIndex: 'studentCode',
      key: 'studentCode',
      render: (text) => (
        <Text type='secondary' className='font-mono text-xs'>
          {text}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'evaluationStatus',
      key: 'evaluationStatus',
      align: 'center',
      render: (status) => {
        const conf = getEvalStatusText(status);
        return (
          <Tag color={conf.color} className='m-0 rounded-full px-3 text-[11px] font-bold'>
            {conf.label}
          </Tag>
        );
      },
    },
    {
      title: 'Điểm số',
      dataIndex: 'totalScore',
      key: 'totalScore',
      align: 'center',
      render: (score, record) => {
        if (record.evaluationStatus < 3)
          return (
            <Text type='secondary' className='text-xs italic'>
              --
            </Text>
          );

        // Mask scores for others
        if (record.studentId !== myStudentId) {
          return (
            <Tooltip title='Điểm số được bảo mật'>
              <span className='m-auto flex w-fit items-center justify-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-[10px] tracking-widest text-[#94a3b8]'>
                <LockOutlined className='text-[10px]' /> ***
              </span>
            </Tooltip>
          );
        }

        return (
          <span className='m-auto block w-fit rounded-full border border-[#d52020]/20 bg-[#d52020]/10 px-3 py-1 text-base font-black text-[#d52020]'>
            {Number(score).toFixed(1)}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      render: (_, record) => {
        if (record.studentId !== myStudentId) return null;
        if (record.evaluationStatus < 3) {
          return (
            <Tooltip title='Phiếu điểm chưa được công bố'>
              <Button
                type='text'
                disabled
                icon={<ClockCircleFilled />}
                className='text-xs font-medium text-slate-400'
              >
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
            className='rounded-full border-none bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 transition-all hover:!bg-[#d52020]/90'
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
        <div className='flex items-center gap-3'>
          <div className='rounded-xl bg-[#d52020]/10 p-2.5 text-[#d52020] shadow-sm'>
            <TeamOutlined className='text-2xl' />
          </div>
          <div>
            <h2 className='m-0 text-xl font-black tracking-tight text-slate-900'>
              Tiến độ Đánh giá Nhóm
            </h2>
            <Text
              type='secondary'
              className='text-sm font-bold tracking-wider text-slate-400 uppercase'
            >
              {cycle.name}
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={850}
      className='custom-team-eval-modal'
      centered
      closeIcon={
        <span className='material-symbols-outlined text-slate-400 transition-colors hover:text-slate-700'>
          close
        </span>
      }
    >
      <div className='pt-6'>
        <div className='mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl'>
          <AppTable
            columns={columns}
            data={teamData}
            pagination={false}
            rowKey='studentId'
            rowClassName={(record) =>
              record.studentId === myStudentId
                ? 'bg-[#d52020]/5'
                : 'hover:bg-slate-50/50 transition-colors'
            }
          />
        </div>

        <div className='flex items-start gap-3 rounded-2xl border border-slate-100/50 bg-slate-50 p-4 shadow-inner'>
          <ExclamationCircleFilled className='mt-0.5 text-[#94a3b8]' />
          <p className='m-0 text-[13px] leading-relaxed font-medium text-slate-500'>
            Vì lý do bảo mật, điểm số của các thành viên khác trong nhóm sẽ được ẩn (hiển thị{' '}
            <span className='rounded border border-slate-300 bg-slate-200 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-600'>
              ***
            </span>
            ). Bạn chỉ có thể xem chi tiết phiếu điểm của chính mình khi trạng thái là{' '}
            <span className='font-black text-slate-700'>Đã công bố</span>.
          </p>
        </div>
      </div>
    </Modal>
  );
}
