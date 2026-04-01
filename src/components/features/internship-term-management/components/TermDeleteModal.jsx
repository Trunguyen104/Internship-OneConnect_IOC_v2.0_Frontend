import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const TermDeleteModal = ({ open, onCancel, onConfirm, record, loading }) => {
  const { DELETE } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;

  return (
    <CompoundModal open={open} onCancel={onCancel} width={480}>
      <CompoundModal.Header
        title={DELETE.TITLE}
        subtitle={DELETE.SUBTITLE}
        type="danger"
        icon={<DeleteOutlined />}
      />

      <CompoundModal.Content className="!pb-0">
        <div className="flex flex-col gap-5">
          <div className="text-muted text-sm leading-relaxed">
            {DELETE.CONTENT_PREFIX} <span className="text-text font-bold">{record?.name}</span>
            {DELETE.CONTENT_SUFFIX}
          </div>

          <CompoundModal.InfoBox
            label={INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.TABLE.COLUMNS.NAME}
            value={record?.name}
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
        confirmText={DELETE.CONFIRM}
        cancelText={DELETE.CANCEL}
      />
    </CompoundModal>
  );
};

export default TermDeleteModal;
