'use client';

import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { Edit3, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';

import EnterprisesDialog from './EnterprisesDialog';

export default function EnterprisesAction({ enterprise }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${enterprise.name}? This action cannot be undone.`)
    )
      return;

    setLoading(true);
    try {
      await enterpriseService.delete(enterprise.enterpriseId || enterprise.id);
      useEnterprisesStore.increment();
      toast.success('Successfully removed partner');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Removal process failed');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    ...(enterprise.website
      ? [
          {
            key: 'website',
            label: (
              <div className="flex items-center gap-3 py-1 pr-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <ExternalLink className="size-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">
                    {UI_TEXT.ENTERPRISES.OPEN_WEBSITE}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {UI_TEXT.ENTERPRISES.OFFICIAL_PAGE}
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
        <div className="flex items-center gap-3 py-1 pr-4">
          <div className="rounded-lg bg-amber-50 p-2">
            <Edit3 className="size-4 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">
              {UI_TEXT.ENTERPRISES.EDIT_PROFILE}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              {UI_TEXT.ENTERPRISES.UPDATE_INFO}
            </span>
          </div>
        </div>
      ),
      onClick: () => setOpenEdit(true),
    },
    { type: 'divider' },
    {
      key: 'delete',
      danger: true,
      label: (
        <div className="flex items-center gap-3 py-1 pr-4">
          <div className="rounded-lg bg-rose-50 p-2">
            <Trash2 className="size-4 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-rose-600">{UI_TEXT.BUTTON.DELETE}</span>
            <span className="text-[10px] font-medium text-rose-400 uppercase tracking-wider">
              {UI_TEXT.ENTERPRISES.DELETE_DESC}
            </span>
          </div>
        </div>
      ),
      onClick: handleDelete,
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
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-slate-400 hover:bg-white hover:shadow-lg transition-all active:scale-95 border border-transparent hover:border-slate-100"
          disabled={loading}
        >
          <EllipsisOutlined className="rotate-90 text-[20px] text-slate-600" />
        </Button>
      </Dropdown>

      {openEdit && (
        <EnterprisesDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          enterprise={enterprise}
          controlled
        />
      )}
    </>
  );
}
