'use client';

import { Alert, Checkbox, Modal, Space } from 'antd';
import React, { useState } from 'react';

import Button from '@/components/ui/button';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import EnterprisePhaseSelect from '../../internship-placement/components/EnterprisePhaseSelect';

const BulkAssignModal = ({ visible, onCancel, onConfirm, loading, selectedCount, termId }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [force, setForce] = useState(true);

  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const UI = ENROLLMENT_MANAGEMENT.MESSAGES.BULK_ASSIGN;

  const handleConfirm = () => {
    if (!selectedPhase) return;
    onConfirm({
      enterpriseId: selectedPhase.enterpriseId,
      internPhaseId: selectedPhase.internPhaseId || selectedPhase.id,
      force,
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full" />
          <span className="text-xl font-bold text-text">{UI.MODAL_TITLE}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" variant="muted" onClick={onCancel}>
          {ENROLLMENT_MANAGEMENT.MODALS.ADD_EDIT.CANCEL}
        </Button>,
        <Button
          key="confirm"
          variant="primary"
          loading={loading}
          disabled={!selectedPhase}
          onClick={handleConfirm}
        >
          {ENROLLMENT_MANAGEMENT.ACTIONS.BULK_ASSIGN}
        </Button>,
      ]}
      width={500}
      centered
      destroyOnClose
    >
      <Space direction="vertical" className="w-full py-4" size={20}>
        <Alert
          type="info"
          showIcon
          message={
            <div className="text-sm">
              {UI.ASSIGNING_PREFIX} <strong>{selectedCount}</strong> {UI.ASSIGNING_SUFFIX}
            </div>
          }
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-text uppercase tracking-wider">
            {UI.SELECTOR_LABEL}
          </label>
          <EnterprisePhaseSelect
            termId={termId}
            value={selectedPhase?.internPhaseId || selectedPhase?.id}
            onChange={(id, phase) => setSelectedPhase(phase)}
          />
        </div>

        <div className="p-4 bg-bg rounded-xl border border-border/50">
          <Checkbox checked={force} onChange={(e) => setForce(e.target.checked)}>
            <span className="text-sm font-medium text-text">{UI.FORCE_LABEL}</span>
          </Checkbox>
          <div className="mt-1 ml-6 text-xs text-muted">{UI.FORCE_DESC}</div>
        </div>

        {!selectedPhase && (
          <div className="text-center py-2 italic text-muted text-xs">{UI.SELECT_PHASE_PROMPT}</div>
        )}
      </Space>
    </Modal>
  );
};

export default BulkAssignModal;
