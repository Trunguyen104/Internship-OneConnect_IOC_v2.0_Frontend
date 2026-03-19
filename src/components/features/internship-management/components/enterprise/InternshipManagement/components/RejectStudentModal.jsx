'use client';

import React, { useState } from 'react';
import { Input, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

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
    <CompoundModal open={open} onCancel={handleCancel} width={520} destroyOnHidden>
      <CompoundModal.Header
        icon={<ExclamationCircleOutlined className='text-danger' />}
        title={REJECT.TITLE}
        subtitle={`${REJECT.WARNING_TEXT_1} ${student?.fullName || ''}`}
        type='danger'
      />

      <div className='p-6'>
        <div className='bg-danger-surface border-danger mb-6 rounded-xl border-l-4 p-4'>
          <Text className='text-muted text-xs leading-relaxed'>{REJECT.WARNING_TEXT_2}</Text>
        </div>

        <div className='space-y-3'>
          <label className='text-text text-xs font-bold tracking-wider uppercase'>
            {REJECT.REASON_LABEL} <span className='text-danger'>*</span>
          </label>
          <Input.TextArea
            className='bg-surface border-border focus:ring-primary min-h-[140px] w-full rounded-xl px-4 py-3 text-sm transition-all focus:ring-2'
            placeholder={REJECT.REASON_PLACEHOLDER}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <CompoundModal.Footer
          cancelText={REJECT.CANCEL}
          submitText={REJECT.SUBMIT}
          onCancel={handleCancel}
          onSubmit={handleConfirm}
          submitDanger
          submitDisabled={!reason.trim()}
          className='mt-8 pt-6'
        />
      </div>
    </CompoundModal>
  );
};

export default RejectStudentModal;
