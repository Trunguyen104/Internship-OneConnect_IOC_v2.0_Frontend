import { Dropdown } from 'antd';
import { EllipsisVertical, Trash2, XCircle } from 'lucide-react';
import React from 'react';

import { STUDENT_APPLICATIONS_UI } from '../constants/uiText';

const TableRowDropdown = ({ application, handlers, modal }) => {
  const { onWithdraw, onHide } = handlers;

  const items = [
    {
      key: 'withdraw',
      label: (
        <div className="flex items-center gap-2 px-1 py-0.5 text-rose-600">
          <XCircle className="size-4" />
          <span className="font-bold text-[13px]">{STUDENT_APPLICATIONS_UI.ACTIONS.WITHDRAW}</span>
        </div>
      ),
      disabled: !application.canWithdraw,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onWithdraw(application);
      },
    },
    {
      key: 'hide',
      label: (
        <div className="flex items-center gap-2 px-1 py-0.5 text-slate-600">
          <Trash2 className="size-4" />
          <span className="font-bold text-[13px]">{STUDENT_APPLICATIONS_UI.ACTIONS.HIDE}</span>
        </div>
      ),
      disabled: !application.canHide,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onHide(application);
      },
    },
  ].filter((item) => {
    // Only show withdraw if applicable
    if (item.key === 'withdraw' && application.status > 3) return false;
    return true;
  });

  if (items.length === 0) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300">
        <EllipsisVertical className="size-4 opacity-20" />
      </div>
    );
  }

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="min-w-[180px]"
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-slate-100/80 active:scale-95 group-hover:text-indigo-600"
        onClick={(e) => e.stopPropagation()}
      >
        <EllipsisVertical className="size-4" />
      </div>
    </Dropdown>
  );
};

export default TableRowDropdown;
