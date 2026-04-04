'use client';

import { CloseCircleOutlined, SwapOutlined, UserAddOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import React from 'react';

import Button from '@/components/ui/button';

import { PLACEMENT_STATUS, SEMESTER_STATUS } from '../constants/placement.constants';
import AssignEnterprisePopover from './AssignEnterprisePopover';

/**
 * AC-01, AC-05, AC-06: Individual row actions.
 * Handles single assign, re-assign, and unassign.
 */
const StudentRowActions = ({ student, semesterId, semesterStatus, onUnassign }) => {
  const isEnded =
    semesterStatus === SEMESTER_STATUS.ENDED || semesterStatus === SEMESTER_STATUS.CLOSED;
  const hasData = student.hasInternshipData;
  const status = student.placementStatus;
  const UI = PLACEMENT_UI_TEXT.ACTIONS;
  const LABELS = PLACEMENT_UI_TEXT.TABLE;

  // Render Assign Button (Unplaced)
  if (status === PLACEMENT_STATUS.UNPLACED) {
    return (
      <AssignEnterprisePopover studentId={student.id || student.StudentId} semesterId={semesterId}>
        <Tooltip title={isEnded ? UI.ENDED_TOOLTIP : UI.ASSIGN_TITLE}>
          <span>
            <Button
              variant="primary-soft"
              size="xs"
              disabled={isEnded}
              className="flex items-center gap-1.5"
            >
              <UserAddOutlined className="text-[10px]" /> {LABELS.ACTION_ASSIGN}
            </Button>
          </span>
        </Tooltip>
      </AssignEnterprisePopover>
    );
  }

  // Render Change/Cancel Buttons (Pending or Placed)
  return (
    <Space size={4}>
      {/* Change Enterprise - Only for Placed (status 1) */}
      {status === PLACEMENT_STATUS.PLACED && (
        <AssignEnterprisePopover
          studentId={student.id || student.StudentId}
          semesterId={semesterId}
        >
          <Tooltip
            title={hasData ? UI.DATA_EXISTS_TOOLTIP : isEnded ? UI.ENDED_TOOLTIP : UI.CHANGE_TITLE}
          >
            <span>
              <Button
                variant="info-soft"
                size="xs"
                disabled={hasData || isEnded}
                className="flex items-center gap-1.5"
              >
                <SwapOutlined className="text-[10px]" /> {LABELS.ACTION_CHANGE}
              </Button>
            </span>
          </Tooltip>
        </AssignEnterprisePopover>
      )}

      {/* Cancel Placement */}
      <Tooltip
        title={hasData ? UI.DATA_EXISTS_TOOLTIP : isEnded ? UI.ENDED_TOOLTIP : UI.CANCEL_TITLE}
      >
        <span>
          <Button
            variant="danger-soft"
            size="xs"
            disabled={hasData || isEnded}
            className="flex items-center gap-1.5"
            onClick={() => onUnassign(student)}
          >
            <CloseCircleOutlined className="text-[10px]" /> {LABELS.ACTION_CANCEL}
          </Button>
        </span>
      </Tooltip>
    </Space>
  );
};

export default StudentRowActions;
