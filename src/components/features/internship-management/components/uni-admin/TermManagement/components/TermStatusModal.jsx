'use client';

import React, { useState } from 'react';
import { Modal, Button, Typography, Input, Space } from 'antd';
import { WarningOutlined, InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

const TermStatusModal = ({ open, onCancel, onConfirm, record, newStatus }) => {
  const { STATUS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;
  const isOpening = newStatus === 1;
  const isClosing = newStatus === 3;
  const [reason, setReason] = useState('');

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      afterClose={() => setReason('')}
      centered
      width={480}
      destroyOnClose
      title={
        <Space>
          {isOpening ? (
            <InfoCircleOutlined className='text-primary' />
          ) : (
            <WarningOutlined className='text-danger' />
          )}
          <span>{STATUS.TITLE}</span>
        </Space>
      }
      footer={[
        <Button key='cancel' onClick={onCancel}>
          {STATUS.CANCEL}
        </Button>,
        <Button
          key='confirm'
          type='primary'
          danger={!isOpening}
          onClick={() => onConfirm(reason)}
          icon={<SyncOutlined />}
        >
          {STATUS.CONFIRM}
        </Button>,
      ]}
    >
      <div className='mt-4 flex flex-col gap-4'>
        <Text type='secondary'>
          {STATUS.CONTENT}{' '}
          <Text strong>
            {INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[newStatus]}
          </Text>
          ?
        </Text>

        <div className='rounded-lg bg-gray-50 p-3'>
          <Text strong italic>
            &quot;{record?.name}&quot;
          </Text>
        </div>

        {isClosing && (
          <div className='text-left'>
            <Text strong className='mb-2 block text-sm'>
              {STATUS.REASON_LABEL}
            </Text>
            <Input.TextArea
              placeholder={STATUS.REASON_PLACEHOLDER}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TermStatusModal;
