'use client';

import React, { useState } from 'react';
import { Modal, Button, Typography, Input, Space } from 'antd';
import { WarningOutlined, DeleteOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

const TermDeleteModal = ({ open, onCancel, onConfirm, record, loading }) => {
  const { DELETE } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;
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
          <WarningOutlined className='text-danger' />
          <span>{DELETE.TITLE}</span>
        </Space>
      }
      footer={[
        <Button key='cancel' onClick={onCancel} disabled={loading}>
          {DELETE.CANCEL}
        </Button>,
        <Button
          key='confirm'
          type='primary'
          danger
          loading={loading}
          onClick={() => onConfirm(reason)}
          icon={<DeleteOutlined />}
        >
          {DELETE.CONFIRM}
        </Button>,
      ]}
    >
      <div className='mt-4 flex flex-col gap-4'>
        <Text type='secondary'>
          {DELETE.CONTENT_PREFIX}{' '}
          <Text strong italic>
            &quot;{record?.name}&quot;
          </Text>
          {DELETE.CONTENT_SUFFIX}
        </Text>

        <div className='text-left'>
          <Text strong className='mb-2 block text-sm'>
            {DELETE.REASON_LABEL} <Text type='danger'>*</Text>
          </Text>
          <Input.TextArea
            placeholder={DELETE.REASON_PLACEHOLDER}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            status={!reason && 'error'}
          />
          {!reason && (
            <Text type='danger' className='text-[12px]'>
              {DELETE.REASON_REQUIRED}
            </Text>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TermDeleteModal;
