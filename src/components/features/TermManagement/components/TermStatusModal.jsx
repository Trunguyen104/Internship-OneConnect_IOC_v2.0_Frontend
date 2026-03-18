import React, { useState } from 'react';
import { Typography, Input } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import CompoundModal from '@/components/ui/CompoundModal';

const { Text } = Typography;

const TermStatusModal = ({ open, onCancel, onConfirm, record, newStatus }) => {
  const { STATUS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;
  const isOpening = Number(newStatus) === 2;
  const [reason, setReason] = useState('');

  const statusLabel =
    INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[newStatus] ||
    INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[String(newStatus)] ||
    newStatus;

  return (
    <CompoundModal open={open} onCancel={onCancel} width={480} afterClose={() => setReason('')}>
      <CompoundModal.Header title={STATUS.TITLE} />

      <CompoundModal.Content>
        <div className='flex flex-col gap-4'>
          <div className='text-muted text-sm'>
            {STATUS.CONTENT} <span className='text-text font-bold'>&quot;{statusLabel}&quot;</span>
          </div>

          <CompoundModal.InfoBox
            label={INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.TABLE.COLUMNS.NAME}
            value={record?.name}
          />

          {!isOpening && (
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
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={() => onConfirm(reason)}
        confirmText={STATUS.CONFIRM}
        cancelText={STATUS.CANCEL}
        danger={!isOpening}
        confirmIcon={<SyncOutlined />}
      />
    </CompoundModal>
  );
};

export default TermStatusModal;
