import { Dropdown } from 'antd';
import { List, Trash2, UserPen } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
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
        <div className="flex items-center gap-4 py-1.5 pr-8">
          <div className="rounded-xl bg-blue-50/50 p-2.5">
            <UserPen className="size-4 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-text">
              {UI_TEXT.UNIVERSITIES.UPDATE}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
              {UI_TEXT.UNIVERSITIES.UPDATE_DESC}
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
      danger: true,
      label: (
        <div className="flex items-center gap-4 py-1.5 pr-8">
          <div className="rounded-xl bg-rose-50/50 p-2.5">
            <Trash2 className="size-4 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-rose-600">
              {UI_TEXT.BUTTON.DELETE}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
              {UI_TEXT.UNIVERSITIES.IRREVERSIBLE}
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
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-2xl text-muted transition-all hover:bg-white hover:shadow-xl active:scale-95 border border-transparent hover:border-gray-100"
        >
          <List className="size-5" />
        </Button>
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
