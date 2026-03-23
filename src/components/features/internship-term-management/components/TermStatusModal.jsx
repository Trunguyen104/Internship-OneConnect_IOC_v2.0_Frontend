import { SyncOutlined } from '@ant-design/icons';
import { Input, Typography } from 'antd';
import React, { useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import {
  INTERNSHIP_MANAGEMENT_UI,
  TERM_STATUS,
} from '@/constants/internship-management/internship-management';

const { Text } = Typography;

const TermStatusModal = ({ open, onCancel, onConfirm, record, newStatus }) => {
  const { STATUS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;
  const isOpening = Number(newStatus) === TERM_STATUS.ACTIVE;
  const [reason, setReason] = useState('');

  const statusLabel =
    INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[newStatus] ||
    INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.STATUS_LABELS[String(newStatus)] ||
    newStatus;

  return (
    <CompoundModal open={open} onCancel={onCancel} width={500} afterClose={() => setReason('')}>
      <CompoundModal.Header
        title={STATUS.TITLE}
        subtitle={`Update term status to ${statusLabel}`}
        type={isOpening ? 'success' : 'warning'}
        icon={<SyncOutlined />}
      />

      <CompoundModal.Content className="!pb-0">
        <div className="flex flex-col gap-5">
          <div className="text-muted text-sm leading-relaxed">
            {STATUS.CONTENT} <span className="text-text font-bold">&quot;{statusLabel}&quot;</span>.
            {!isOpening && ' Once closed, students will no longer be able to enroll.'}
          </div>

          <CompoundModal.InfoBox
            label={INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.TABLE.COLUMNS.NAME}
            value={record?.name}
            color={isOpening ? 'success' : 'warning'}
          />

          {!isOpening && (
            <div className="space-y-2">
              <Text strong className="text-text block text-sm">
                {STATUS.REASON_LABEL}
              </Text>
              <Input.TextArea
                placeholder={STATUS.REASON_PLACEHOLDER}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="!rounded-xl !bg-gray-50/50 focus:!bg-white"
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
        className="!mt-2"
      />
    </CompoundModal>
  );
};

export default TermStatusModal;
