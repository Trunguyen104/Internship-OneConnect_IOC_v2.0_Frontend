import { Dropdown } from 'antd';
import { MoreVertical, Trash2, UserPen } from 'lucide-react';
import { useState } from 'react';

import { UI_TEXT } from '@/lib/UI_Text';

import UniversitiesDeleteModal from './UniversitiesDeleteModal';
import UniversitiesDialog from './UniversitiesDialog';

export default function UniversitiesAction({ university }) {
  const [open, setOpen] = useState({ isOpen: false, modal: null });

  const handleAction = (modalType) => {
    setOpen({ isOpen: !!modalType, modal: modalType });
  };

  const menuItems = [
    {
      key: 'edit',
      label: (
        <div className="flex items-center gap-4 pr-8">
          <div className="rounded-xl bg-blue-50/50 p-2.5">
            <UserPen className="size-4 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-text">
              {UI_TEXT.UNIVERSITIES.UPDATE}
            </span>
          </div>
        </div>
      ),
      onClick: () => handleAction('edit'),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: (
        <div className="flex items-center gap-4 pr-8">
          <div className="rounded-xl bg-rose-50/50 p-2.5">
            <Trash2 className="size-4 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-rose-600">
              {UI_TEXT.BUTTON.DELETE}
            </span>
          </div>
        </div>
      ),
      onClick: () => handleAction('delete'),
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        classNames={{ root: 'premium-dropdown' }}
      >
        <button className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical className="size-4" />
        </button>
      </Dropdown>

      {open.isOpen && open.modal === 'edit' && (
        <UniversitiesDialog
          open={open.isOpen}
          onOpenChange={() => handleAction(null)}
          university={university}
          controlled
        />
      )}

      {open.isOpen && open.modal === 'delete' && (
        <UniversitiesDeleteModal
          open={open.isOpen}
          onOpenChange={() => handleAction(null)}
          university={university}
        />
      )}
    </>
  );
}
