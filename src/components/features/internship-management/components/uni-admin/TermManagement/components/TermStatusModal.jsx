'use client';

import React from 'react';
import { Modal, Button, Typography, Space, Divider } from 'antd';
import { WarningOutlined, InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title, Text } = Typography;

const TermStatusModal = ({ open, onCancel, onConfirm, record, newStatus }) => {
  const { STATUS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;
  const isOpening = newStatus === 1;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={440}
      destroyOnHidden
      className='modal-custom'
    >
      <div className='flex flex-col items-center gap-4 text-center'>
        <div
          className={`flex size-16 items-center justify-center rounded-2xl ${
            isOpening ? 'bg-primary/10' : 'bg-danger/10'
          }`}
        >
          {isOpening ? (
            <InfoCircleOutlined className='text-primary text-4xl' />
          ) : (
            <WarningOutlined className='text-danger text-4xl' />
          )}
        </div>

        <div>
          <Title level={4} className='text-text mb-1'>
            {STATUS.TITLE}
          </Title>
          <Text className='text-muted text-sm'>
            {STATUS.CONTENT}{' '}
            <Text className={`font-bold ${isOpening ? 'text-primary' : 'text-danger'}`}>
              {isOpening ? 'Đang hoạt động' : 'Đã hoàn thành'}
            </Text>
            ?
          </Text>
        </div>

        <div className='bg-muted/5 w-full rounded-xl p-4'>
          <Text className='text-text text-sm font-semibold italic'>&quot;{record?.name}&quot;</Text>
        </div>

        {!isOpening && (
          <Text className='text-danger text-xs italic'>
            * Lưu ý: Khi chuyển sang Đã hoàn thành, các cấu hình của đợt này sẽ bị khóa.
          </Text>
        )}

        <Divider className='border-border my-2' />

        <div className='flex w-full gap-3'>
          <Button
            onClick={onCancel}
            className='border-border h-11 flex-1 rounded-xl font-semibold transition-all hover:bg-slate-50'
          >
            {STATUS.CANCEL}
          </Button>
          <Button
            type='primary'
            danger={!isOpening}
            onClick={onConfirm}
            icon={<SyncOutlined />}
            className={`h-11 flex-1 rounded-xl border-none font-bold shadow-md transition-all hover:scale-105 active:scale-95 ${
              isOpening ? 'bg-primary' : 'bg-danger'
            }`}
          >
            {STATUS.CONFIRM}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TermStatusModal;
