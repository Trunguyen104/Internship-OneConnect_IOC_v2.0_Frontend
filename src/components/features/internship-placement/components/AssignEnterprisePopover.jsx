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
const AssignEnterprisePopover = ({ student, children, termName, termId, disabled = false }) => {
  // AC-01 Fix: studentId must be a GUID, not studentCode (ST000...).
  // enrollment record usually has 'studentId' as the GUID.
  const studentGuid = student.studentId || (student.id?.length > 20 ? student.id : null);

  const [selectedPhase, setSelectedPhase] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const UI = PLACEMENT_UI_TEXT.POPOVER;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => {
      if (data.isReassign) {
        // AC-05: Backend expects applicationId and NEW IDs
        const command = {
          applicationId: data.applicationId,
          newEnterpriseId: data.enterpriseId,
          newInternPhaseId: data.internPhaseId,
        };
        return PlacementService.reassignSingle(command);
      }
      return PlacementService.assignStudent(data);
    },
    onSuccess: (res) => {
      if (res?.success === false) {
        message.error(res?.message || 'Race condition: Phase might be full.');
      } else {
        const entName = selectedPhase?.enterpriseName || 'Enterprise';
        const stuName = student.fullName || 'Student';
        message.success(UI.SUCCESS(entName, stuName));
        setPopoverVisible(false);
        queryClient.invalidateQueries(['semester-students']);
      }
    },
    onError: (err) => {
      message.error(err?.message || 'Failed to assign enterprise.');
    },
  });

  const hasConflict =
    selectedPhase && student.activeSelfApplyEnterpriseIds?.includes(selectedPhase.enterpriseId);

  const handleConfirm = () => {
    if (disabled) return;
    if (!selectedPhase) {
      message.warning('Please select an enterprise and phase.');
      return;
    }

    // AC-11: Robust conflict detection with status
    const conflictApp = student.selfApplyApplications?.find(
      (app) =>
        app.enterpriseId === selectedPhase.enterpriseId &&
        ([1, 2, 3].includes(app.status) ||
          ['Applied', 'Interviewing', 'Offered'].includes(app.statusLabel))
    );

    if (conflictApp) {
      Modal.error({
        title: <span className="font-bold text-danger">{UI.CONFLICT_TITLE}</span>,
        content: (
          <div className="text-sm text-slate-600 leading-relaxed py-2">
            {UI.CONFLICT_ERROR(
              student.fullName,
              selectedPhase.enterpriseName,
              conflictApp.statusLabel
            )}
          </div>
        ),
        okText: UI.GOT_IT,
        centered: true,
      });
      return;
    }

    const isReassign =
      (student.displayStatus === 5 || student.displayStatus === 4) && student.applicationId;
    const newEntName = selectedPhase.enterpriseName;
    const oldEntName = student.enterpriseName || 'Doanh nghiệp cũ';

    const execute = () => {
      const command = {
        studentId: studentGuid,
        termId: termId,
        enterpriseId: selectedPhase.enterpriseId,
        internPhaseId: selectedPhase.internPhaseId || selectedPhase.id,
      };

      if (isReassign) {
        mutation.mutate({
          ...command,
          applicationId: student.applicationId,
          newEnterpriseId: selectedPhase.enterpriseId,
          newInternPhaseId: selectedPhase.internPhaseId || selectedPhase.id,
          isReassign: true,
        });
      } else {
        mutation.mutate(command);
      }
    };

    if (isReassign) {
      Modal.confirm({
        title: <span className="font-bold text-slate-800">{UI.REASSIGN_TITLE}</span>,
        content: (
          <div className="text-sm text-slate-600 leading-relaxed py-2">
            {UI.REASSIGN_CONFIRM(student.fullName, oldEntName, newEntName)}
          </div>
        ),
        okText: UI.REASSIGN_CONFIRM_BTN,
        cancelText: UI.CANCEL,
        centered: true,
        onOk: execute,
      });
    } else {
      execute();
    }
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
            disabled={!selectedPhase || hasConflict || disabled}
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
      trigger={disabled ? [] : 'click'}
      open={disabled ? false : popoverVisible}
      onOpenChange={disabled ? undefined : setPopoverVisible}
      placement="bottomRight"
      overlayClassName="placement-popover"
    >
      <span onClick={(e) => !disabled && e.stopPropagation()}>{children}</span>
    </Popover>
  );
};

export default AssignEnterprisePopover;
