'use client';

import { AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

import CompoundModal from '@/components/ui/compoundmodal';
import Textarea from '@/components/ui/textarea';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

/**
 * Modal to collect rejection reason before processing.
 * Mandatory reason as per AC-05 and AC-10.
 * Refactored using project's CompoundModal for maximum consistency.
 */
export const RejectModal = ({
  open,
  onCancel,
  onConfirm,
  loading,
  title = APPLICATIONS_UI.MODAL_TITLE.REJECT_STANDARD,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm({ reason: reason.trim() });
    setReason('');
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  return (
    <CompoundModal open={open} onCancel={handleCancel} width={480}>
      <CompoundModal.Header
        icon={<AlertTriangle className="size-5" />}
        type="danger"
        title={title}
        subtitle="This action cannot be undone. Please provide a clear reason for the student."
      />

      <CompoundModal.Content className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {APPLICATIONS_UI.MESSAGES.REJECT_REASON_PLACEHOLDER || 'Rejection Reason'}
          </label>
          <Textarea
            placeholder={APPLICATIONS_UI.MESSAGES.REJECT_REASON_PLACEHOLDER}
            rows={4}
            className="rounded-2xl border-slate-200 bg-slate-50/50 p-4 font-medium transition-all focus:bg-white focus:shadow-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        confirmText="Confirm Rejection"
        loading={loading}
        danger={true}
        disabled={!reason.trim()}
      />
    </CompoundModal>
  );
};

export default RejectModal;
