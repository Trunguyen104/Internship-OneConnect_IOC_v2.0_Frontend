'use client';

import { CloseCircleOutlined, SwapOutlined, UserAddOutlined } from '@ant-design/icons';
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

  const LABELS = PLACEMENT_UI_TEXT.TABLE;

  const items = [];

  if (status === PLACEMENT_STATUS.UNPLACED) {
    items.push({
      key: 'assign',
      label: (
        <AssignEnterprisePopover student={student} termName={termName} termId={semesterId}>
          <div className="w-full text-left">{LABELS.ACTION_ASSIGN}</div>
        </AssignEnterprisePopover>
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
          <AssignEnterprisePopover student={student} termName={termName} termId={semesterId}>
            <div className="w-full text-left">{LABELS.ACTION_CHANGE}</div>
          </AssignEnterprisePopover>
        ),
        icon: <SwapOutlined />,
        disabled: hasData || isEnded,
        variant: 'info',
      });
    }

    items.push({
      key: 'cancel',
      label: LABELS.ACTION_CANCEL,
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
