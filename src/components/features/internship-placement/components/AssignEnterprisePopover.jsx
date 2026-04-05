'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, message, Popover, Space } from 'antd';
import React, { useState } from 'react';

import Button from '@/components/ui/button';
import { PLACEMENT_UI_TEXT } from '@/constants/internship-placement/placement.constants';

import { PlacementService } from '../services/placement.service';
import EnterprisePhaseSelect from './EnterprisePhaseSelect';

/**
 * AC-01: Assign Enterprise Nhanh Cho 1 Sinh Viên (Inline popover).
 */
const AssignEnterprisePopover = ({ student, children, termName, termId }) => {
  // AC-01 Fix: studentId must be a GUID, not studentCode (ST000...).
  // enrollment record usually has 'studentId' as the GUID.
  const studentGuid = student.studentId || (student.id?.length > 20 ? student.id : null);

  const [selectedPhase, setSelectedPhase] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const UI = PLACEMENT_UI_TEXT.POPOVER;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.assignStudent(data),
    onSuccess: (res) => {
      if (res?.success === false) {
        message.error(res?.message || 'Race condition: Phase might be full.');
      } else {
        message.success('Assignment sent. Waiting for enterprise confirmation.');
        setPopoverVisible(false);
        queryClient.invalidateQueries(['semester-students']);
        queryClient.invalidateQueries(['uni-assign-applications']);
      }
    },
    onError: (err) => {
      message.error(err?.message || 'Failed to assign enterprise.');
    },
  });

  const hasConflict =
    selectedPhase && student.activeSelfApplyEnterpriseIds?.includes(selectedPhase.enterpriseId);

  const handleConfirm = () => {
    if (!selectedPhase) {
      message.warning('Please select an enterprise and phase.');
      return;
    }
    if (hasConflict) {
      message.error(`${student.fullName} has an active self-apply at this enterprise.`);
      return;
    }
    // Matching QuickEnterpriseAssignmentCommand (UniAssignRequest) fields:
    // Need studentId, termId, enterpriseId, internPhaseId (all GUIDs)
    mutation.mutate({
      studentId: studentGuid,
      termId: termId,
      enterpriseId: selectedPhase.enterpriseId,
      internPhaseId: selectedPhase.internPhaseId || selectedPhase.id,
    });
  };

  const content = (
    <div className="w-[320px] p-1">
      <Space direction="vertical" className="w-full" size={12}>
        <div className="text-sm font-semibold text-slate-700">{UI.QUICK_ASSIGNMENT}</div>
        <EnterprisePhaseSelect
          value={selectedPhase?.internPhaseId || selectedPhase?.id}
          onChange={(id, phase) => setSelectedPhase(phase)}
          termName={termName}
        />

        {hasConflict && (
          <Alert
            type="error"
            showIcon
            message={<span className="text-[11px] font-bold">{UI.CONFLICT_TITLE}</span>}
            description={<span className="text-[10px]">{UI.CONFLICT_DESC}</span>}
          />
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="muted" size="sm" onClick={() => setPopoverVisible(false)}>
            {UI.CANCEL}
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={mutation.isLoading}
            onClick={handleConfirm}
            disabled={!selectedPhase || hasConflict}
          >
            {UI.ASSIGN}
          </Button>
        </div>
      </Space>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={popoverVisible}
      onOpenChange={setPopoverVisible}
      placement="bottomRight"
      overlayClassName="placement-popover"
    >
      <span onClick={(e) => e.stopPropagation()}>{children}</span>
    </Popover>
  );
};

export default AssignEnterprisePopover;
