'use client';

import { CloseCircleOutlined, SwapOutlined, UserAddOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

import TableRowDropdown from '@/components/ui/TableRowActions';
import {
  PLACEMENT_STATUS,
  PLACEMENT_UI_TEXT,
  SEMESTER_STATUS,
} from '@/constants/internship-placement/placement.constants';

import AssignEnterprisePopover from './AssignEnterprisePopover';

/**
 * AC-01, AC-05, AC-06: Individual row actions using standard Dropdown.
 */
const StudentRowActions = ({ student, semesterId, semesterStatus, onUnassign, termName }) => {
  const isEnded =
    semesterStatus === SEMESTER_STATUS.ENDED || semesterStatus === SEMESTER_STATUS.CLOSED;
  const hasData = student.hasInternshipData;

  const isUnplaced = !student.enterpriseName || student.enterpriseName === '— Unassigned —';
  const status = isUnplaced ? PLACEMENT_STATUS.UNPLACED : student.displayStatus;

  const UI = PLACEMENT_UI_TEXT.ACTIONS;
  const LABELS = PLACEMENT_UI_TEXT.TABLE;

  const getDisabledTooltip = () => {
    if (isEnded) return UI.ENDED_TOOLTIP;
    if (hasData)
      return UI.DATA_EXISTS_TOOLTIP(
        student.fullName,
        student.enterpriseName || 'Doanh nghiệp hiện tại'
      );
    return null;
  };

  const tooltipText = getDisabledTooltip();

  const items = [];

  if (status === PLACEMENT_STATUS.UNPLACED) {
    items.push({
      key: 'assign',
      label: (
        <Tooltip title={isEnded ? UI.ENDED_TOOLTIP : null}>
          <div className="w-full">
            <AssignEnterprisePopover
              student={student}
              termName={termName}
              termId={semesterId}
              disabled={isEnded}
            >
              <div className="w-full text-left">{LABELS.ACTION_ASSIGN}</div>
            </AssignEnterprisePopover>
          </div>
        </Tooltip>
      ),
      icon: <UserAddOutlined />,
      disabled: isEnded,
      variant: 'primary',
    });
  } else {
    if (status === PLACEMENT_STATUS.PLACED) {
      items.push({
        key: 'change',
        label: (
          <Tooltip title={tooltipText}>
            <div className="w-full">
              <AssignEnterprisePopover
                student={student}
                termName={termName}
                termId={semesterId}
                disabled={hasData || isEnded}
              >
                <div className="w-full text-left">{LABELS.ACTION_CHANGE}</div>
              </AssignEnterprisePopover>
            </div>
          </Tooltip>
        ),
        icon: <SwapOutlined />,
        disabled: hasData || isEnded,
        variant: 'info',
      });
    }

    items.push({
      key: 'cancel',
      label: (
        <Tooltip title={tooltipText}>
          <div className="w-full">{LABELS.ACTION_CANCEL}</div>
        </Tooltip>
      ),
      icon: <CloseCircleOutlined />,
      danger: true,
      disabled: hasData || isEnded,
      onClick: () => onUnassign(student),
    });
  }

  return (
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <TableRowDropdown items={items} />
    </div>
  );
};

export default StudentRowActions;
