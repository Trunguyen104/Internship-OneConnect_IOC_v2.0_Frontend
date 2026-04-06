import { Dropdown } from 'antd';
import { EllipsisVertical, Eye, Trash2, XCircle } from 'lucide-react';
import React from 'react';

import { APPLICATION_STATUS } from '@/constants/applications/application.constants';

import { STUDENT_APPLICATIONS_UI } from '../constants/uiText';

const TableRowDropdown = ({ application, handlers, modal }) => {
  const { withdraw: onWithdraw, hide: onHide, viewDetail: onViewDetail } = handlers;

  const handleWithdrawClick = (e) => {
    e.domEvent.stopPropagation();
    modal.confirm({
      title: STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW_TITLE,
      content: STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW_CONTENT.replace(
        '{enterpriseName}',
        application.enterpriseName
      ),
      okText: STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW,
      cancelText: STUDENT_APPLICATIONS_UI.MODAL.CANCEL,
      okButtonProps: { danger: true },
      onOk: () => onWithdraw(application.applicationId || application.id),
    });
  };

  const handleHideClick = (e) => {
    e.domEvent.stopPropagation();
    modal.confirm({
      title: STUDENT_APPLICATIONS_UI.MODAL.HIDE_TITLE,
      content: STUDENT_APPLICATIONS_UI.MODAL.HIDE_CONTENT,
      okText: STUDENT_APPLICATIONS_UI.MODAL.HIDE,
      cancelText: STUDENT_APPLICATIONS_UI.MODAL.CANCEL,
      onOk: () => onHide(application.applicationId || application.id),
    });
  };

  const handleViewClick = (e) => {
    e.domEvent.stopPropagation();
    onViewDetail?.(application.applicationId || application.id);
  };

  // Only allow hiding if explicitly allowed by API, or if it's a "Finished" status (Rejected/Withdrawn)
  // We exclude PLACED (Accepted) because the backend forbids hiding it to preserve placement history.
  const canBeHidden =
    application.canHide ||
    [APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.WITHDRAWN].includes(application.status);

  const items = [
    {
      key: 'view',
      label: (
        <div className="flex items-center gap-2 px-1 py-0.5 text-slate-800">
          <Eye className="size-4" />
          <span className="font-bold text-[13px]">
            {STUDENT_APPLICATIONS_UI.ACTIONS.VIEW_DETAILS}
          </span>
        </div>
      ),
      onClick: handleViewClick,
    },
    {
      key: 'withdraw',
      label: (
        <div className="flex items-center gap-2 px-1 py-0.5 text-rose-600">
          <XCircle className="size-4" />
          <span className="font-bold text-[13px]">{STUDENT_APPLICATIONS_UI.ACTIONS.WITHDRAW}</span>
        </div>
      ),
      disabled: !application.canWithdraw,
      onClick: handleWithdrawClick,
    },
    {
      key: 'hide',
      label: (
        <div className="flex items-center gap-2 px-1 py-0.5 text-rose-600">
          <Trash2 className="size-4" />
          <span className="font-bold text-[13px]">{STUDENT_APPLICATIONS_UI.ACTIONS.HIDE}</span>
        </div>
      ),
      onClick: handleHideClick,
    },
  ].filter((item) => {
    // View Details is always available
    if (item.key === 'view') return true;

    // Only show withdraw if applicable
    if (item.key === 'withdraw' && application.status > 3) return false;

    // Only show hide if applicable (Rejected, Withdrawn, or explicitly allowed)
    if (item.key === 'hide' && !canBeHidden) return false;

    return true;
  });

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      classNames={{ root: 'min-w-[180px]' }}
    >
      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-slate-100/80 active:scale-95 group-hover:text-slate-900 text-slate-400"
        onClick={(e) => e.stopPropagation()}
      >
        <EllipsisVertical className="size-4" />
      </div>
    </Dropdown>
  );
};

export default TableRowDropdown;
