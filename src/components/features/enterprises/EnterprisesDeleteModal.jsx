'use client';

import { Modal } from 'antd';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';

export default function EnterprisesDeleteModal({ enterprise, open, onOpenChange }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setBusy(false);
    }
  }, [open]);

  const doDelete = async () => {
    if (!enterprise?.enterpriseId && !enterprise?.id) return;

    setBusy(true);
    try {
      await enterpriseService.delete(enterprise.enterpriseId || enterprise.id);
      toast.success(UI_TEXT.ENTERPRISES.REMOVE_SUCCESS);
      useEnterprisesStore.increment();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || UI_TEXT.COMMON.ERROR);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-rose-100 p-2">
            <Trash2 className="size-5 text-rose-600" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-800">
            {UI_TEXT.ENTERPRISES.DELETE_TITLE || 'Confirm Delete'}
          </span>
        </div>
      }
      open={open}
      onCancel={() => onOpenChange(false)}
      centered
      width={440}
      footer={
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            className="h-9 px-4 rounded-full font-semibold"
            onClick={() => onOpenChange(false)}
          >
            {UI_TEXT.BUTTON.CANCEL}
          </Button>
          <Button
            onClick={doDelete}
            disabled={busy}
            className="h-9 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all active:scale-95"
          >
            {busy ? <Spinner className="size-4" /> : UI_TEXT.BUTTON.DELETE}
          </Button>
        </div>
      }
    >
      <div className="py-6 space-y-3">
        <p className="text-[15px] leading-relaxed text-slate-600">
          {UI_TEXT.ENTERPRISES.DELETE_CONFIRM_MSG}{' '}
          <span className="font-bold text-slate-900 border-b-2 border-rose-100">
            {enterprise?.name}
          </span>
          ?
        </p>
        <p className="text-xs font-medium text-slate-400">{UI_TEXT.ENTERPRISES.DELETE_SUBTITLE}</p>
        <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 text-[11px] font-medium leading-relaxed text-amber-900/80">
          <p className="font-bold mb-0.5">{UI_TEXT.ENTERPRISES.DELETE_HINT}</p>
          <p>{UI_TEXT.ENTERPRISES.DELETE_DEPENDENCY_WARNING}</p>
        </div>
      </div>
    </Modal>
  );
}
