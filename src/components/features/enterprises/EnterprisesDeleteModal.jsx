'use client';

import { Drawer } from 'antd';
import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';

export default function EnterprisesDeleteModal({ enterprise, open, onOpenChange }) {
  const toast = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmed(false);
      setBusy(false);
    }
  }, [open]);

  const doDelete = async (e) => {
    if (e) e.preventDefault();
    if (!confirmed) {
      toast.error('Please confirm delete.');
      return;
    }
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
    <Drawer
      title={
        <div className="flex flex-col gap-1">
          <span className="text-lg font-black tracking-tight text-rose-600">
            {UI_TEXT.ENTERPRISES.DELETE_TITLE || UI_TEXT.BUTTON.DELETE}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {UI_TEXT.ENTERPRISES.DELETE_SUBTITLE}
          </span>
        </div>
      }
      open={open}
      onClose={() => onOpenChange?.(false)}
      width={480}
      headerStyle={{ borderBottom: '1px solid #f8fafc', padding: '24px' }}
      bodyStyle={{ padding: '24px' }}
      footer={
        <div className="flex justify-end gap-3 border-t border-gray-50 p-6 bg-white">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full h-11 px-6 font-bold text-muted/60 hover:text-text transition-colors"
            onClick={() => onOpenChange?.(false)}
          >
            {UI_TEXT.BUTTON.CANCEL}
          </Button>
          <Button
            onClick={doDelete}
            disabled={!confirmed || busy}
            className="bg-rose-500 hover:bg-rose-600 min-w-[140px] rounded-full h-11 font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-50 disabled:hover:scale-100"
          >
            {busy ? <Spinner className="mr-2 h-4 w-4" /> : UI_TEXT.BUTTON.DELETE}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <div className="space-y-6 flex flex-col h-full">
        <div className="flex flex-col gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <span className="text-[11px] font-black uppercase tracking-widest text-muted/60">
            {UI_TEXT.ENTERPRISES.NAME}
          </span>
          <span className="text-sm font-bold text-slate-800">
            {enterprise?.name || UI_TEXT.COMMON.MINUS}
          </span>
          <span className="text-[11px] font-medium tracking-tight text-muted/60 mt-2">
            {UI_TEXT.ENTERPRISES.INDUSTRY_PREFIX}
            {': '}
            {enterprise?.industry || UI_TEXT.COMMON.MINUS}
          </span>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 text-[13px] font-medium leading-relaxed text-rose-900/80 flex gap-3">
          <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-0.5" />
          <span>
            {UI_TEXT.USER_MANAGEMENT.DELETE_CONFIRM}{' '}
            <span className="font-black text-rose-600">
              {enterprise?.name || UI_TEXT.COMMON.MINUS}
            </span>
            {UI_TEXT.COMMON.QUESTION}
          </span>
        </div>

        <div className="flex-1" />

        <div
          className={`group flex cursor-pointer items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${confirmed ? 'border-rose-200 bg-rose-50/50 shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:bg-white'}`}
          onClick={() => setConfirmed(!confirmed)}
        >
          <div className="mt-0.5">
            <Checkbox checked={confirmed} onCheckedChange={setConfirmed} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-black tracking-tight text-text">
              {UI_TEXT.COMMON.DELETE_CONFIRM}
            </span>
            <p className="text-[11px] font-medium leading-relaxed text-muted/60">
              {UI_TEXT.USER_MANAGEMENT.CONFIRM_DELETE_TEXT}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4 text-[12px] font-medium leading-relaxed text-amber-900/80">
          <p className="font-black tracking-tight text-amber-900/80 mb-1">
            {UI_TEXT.ENTERPRISES.DELETE_HINT || UI_TEXT.COMMON.INFO_ICON}
          </p>
          <p>{UI_TEXT.ENTERPRISES.DELETE_DEPENDENCY_WARNING}</p>
        </div>
      </div>
    </Drawer>
  );
}
