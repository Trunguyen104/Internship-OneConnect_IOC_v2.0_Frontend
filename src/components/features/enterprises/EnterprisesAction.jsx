'use client';

import { Dropdown } from 'antd';
import { Edit3, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { UI_TEXT } from '@/lib/UI_Text';

import EnterprisesDeleteModal from './EnterprisesDeleteModal';
import EnterprisesDialog from './EnterprisesDialog';

export default function EnterprisesAction({ enterprise }) {
  const [open, setOpen] = useState({ isOpen: false, modal: null });

  const handleAction = (modalType) => {
    setOpen({ isOpen: !!modalType, modal: modalType });
  };

  const menuItems = [
    ...(enterprise.website
      ? [
          {
            key: 'website',
            label: (
              <div className="flex items-center gap-4 pr-8">
                <div className="rounded-xl bg-blue-50/50 p-2.5">
                  <ExternalLink className="size-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-tight text-text">
                    {UI_TEXT.ENTERPRISES.WEBSITE_TITLE}
                  </span>
                </div>
              </div>
            ),
            onClick: () => window.open(enterprise.website, '_blank'),
          },
        ]
      : []),
    {
      key: 'edit',
      label: (
        <div className="flex items-center gap-4 pr-8">
          <div className="rounded-xl bg-amber-50/50 p-2.5">
            <Edit3 className="size-4 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-text">
              {UI_TEXT.ENTERPRISES.EDIT_TITLE}
            </span>
          </div>
        </div>
      ),
      onClick: () => handleAction('edit'),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: (
        <div className="flex items-center gap-4 pr-8">
          <div className="rounded-xl bg-rose-50/50 p-2.5">
            <Trash2 className="size-4 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-rose-600">
              {UI_TEXT.ENTERPRISES.DELETE_TITLE}
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
        <EnterprisesDialog
          open={open.isOpen}
          onOpenChange={() => handleAction(null)}
          enterprise={enterprise}
          controlled
        />
      )}

      {open.isOpen && open.modal === 'delete' && (
        <EnterprisesDeleteModal
          open={open.isOpen}
          onOpenChange={() => handleAction(null)}
          enterprise={enterprise}
        />
      )}
    </>
  );
}
