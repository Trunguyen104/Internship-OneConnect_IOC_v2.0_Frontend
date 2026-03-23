import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const ViolationDeleteModal = ({ open, onCancel, onConfirm, record, loading }) => {
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { CONFIRM, TABLE } = VIOLATION_REPORT;

  return (
    <CompoundModal open={open} onCancel={onCancel} width={480}>
      <CompoundModal.Header title={CONFIRM.DELETE_TITLE} />

      <CompoundModal.Content>
        <div className="flex flex-col gap-4">
          <div className="text-muted text-sm px-1">{CONFIRM.DELETE_CONTENT}</div>

          <CompoundModal.InfoBox
            label={TABLE.COLUMNS.STUDENT_NAME}
            value={`${record?.studentName} (${record?.studentCode})`}
            color="danger"
          />
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={() => onConfirm()}
        loading={loading}
        danger
        confirmIcon={<DeleteOutlined />}
        confirmText={CONFIRM.DELETE}
        cancelText={CONFIRM.CANCEL}
      />
    </CompoundModal>
  );
};

export default ViolationDeleteModal;
