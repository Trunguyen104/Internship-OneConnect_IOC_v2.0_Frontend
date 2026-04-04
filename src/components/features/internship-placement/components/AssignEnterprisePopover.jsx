'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Popover, Space } from 'antd';
import React, { useState } from 'react';

import Button from '@/components/ui/button';
import Button from '@/components/ui/button';

import { PLACEMENT_UI_TEXT } from '../constants/placement.constants';
import { PlacementService } from '../services/placement.service';
import EnterprisePhaseSelect from './EnterprisePhaseSelect';

/**
 * AC-01: Assign Enterprise Nhanh Cho 1 Sinh Viên (Inline popover).
 */
const AssignEnterprisePopover = ({ studentId, semesterId, children }) => {
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
        queryClient.invalidateQueries(['semester-students', semesterId]);
      }
    },
    onError: (err) => {
      message.error(err?.message || 'Failed to assign enterprise.');
    },
  });

  const handleConfirm = () => {
    if (!selectedPhase) {
      message.warning('Please select an enterprise and phase.');
      return;
    }
    mutation.mutate({ studentId, internPhaseId: selectedPhase });
  };

  const content = (
    <div className="w-[320px] p-1">
      <Space direction="vertical" className="w-full" size={12}>
        <div className="text-sm font-semibold text-slate-700">{UI.QUICK_ASSIGNMENT}</div>
        <EnterprisePhaseSelect
          semesterId={semesterId}
          value={selectedPhase}
          onChange={setSelectedPhase}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="muted" size="sm" onClick={() => setPopoverVisible(false)}>
            {UI.CANCEL}
          </Button>
          <Button variant="primary" size="sm" loading={mutation.isLoading} onClick={handleConfirm}>
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
