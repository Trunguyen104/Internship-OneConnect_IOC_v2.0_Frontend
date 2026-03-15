'use client';

import React, { useState } from 'react';
import { Modal, Input, Button, Typography, Space, Divider } from 'antd';
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';

const { Title, Text } = Typography;

const RejectStudentModal = ({ open, student, onCancel, onConfirm }) => {
  const [reason, setReason] = useState('');
  const { REJECT } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  const handleConfirm = () => {
    if (student && reason.trim()) {
      onConfirm(student.id, reason);
      setReason('');
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      onCancel={handleCancel}
      width={520}
      centered
      className='modal-custom overflow-hidden rounded-2xl'
    >
      <div className='flex flex-col'>
        {/* Header Section */}
        <div className='mb-6 flex flex-col items-center gap-3 text-center'>
          <div className='bg-danger/10 flex size-14 items-center justify-center rounded-2xl'>
            <ExclamationCircleOutlined className='text-danger text-3xl' />
          </div>
          <div>
            <Title level={4} className='text-danger mb-1 tracking-tight uppercase'>
              {REJECT.TITLE}
            </Title>
            <Text className='text-muted text-xs'>
              {REJECT.WARNING_TEXT_1}{' '}
              <span className='text-text font-bold'>{student?.fullName}</span>
            </Text>
          </div>
        </div>

        <Divider className='border-border m-0' />

        {/* Content Section */}
        <div className='mt-6 px-2'>
          <div className='bg-danger/5 border-danger mb-6 rounded-xl border-l-4 p-4'>
            <Text className='text-muted text-xs leading-relaxed'>{REJECT.WARNING_TEXT_2}</Text>
          </div>

          <div className='space-y-3'>
            <label className='text-text block text-sm font-bold'>
              {REJECT.REASON_LABEL} <span className='text-danger'>*</span>
            </label>
            <Input.TextArea
              className='bg-surface border-border focus:ring-primary min-h-[140px] w-full rounded-xl px-4 py-3 text-sm transition-all focus:ring-2'
              placeholder={REJECT.REASON_PLACEHOLDER}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className='mt-10 flex gap-3 px-2 pb-2'>
          <Button
            className='border-border h-11 flex-1 rounded-xl font-semibold transition-all hover:bg-slate-50'
            onClick={handleCancel}
          >
            {REJECT.CANCEL}
          </Button>
          <Button
            type='primary'
            danger
            className='bg-danger h-11 flex-1 rounded-xl border-none font-semibold shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50'
            disabled={!reason.trim()}
            onClick={handleConfirm}
          >
            {REJECT.SUBMIT}
          </Button>
        </div>

        {/* Close Button Shortcut */}
        <button
          className='text-muted hover:text-danger absolute top-6 right-6 transition-colors'
          onClick={handleCancel}
        >
          <CloseCircleOutlined className='text-xl opacity-20 hover:opacity-100' />
        </button>
      </div>
    </Modal>
  );
};

export default RejectStudentModal;
