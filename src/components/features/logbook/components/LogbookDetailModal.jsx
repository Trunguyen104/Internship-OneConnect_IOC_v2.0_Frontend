'use client';

import dayjs from 'dayjs';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

import LogbookStatusTag from './LogbookStatusTag';

const LogbookDetailModal = memo(function LogbookDetailModal({ visible, record, onClose }) {
  const { VIEW_MODAL, FORM, TABLE } = DAILY_REPORT_UI;

  if (!record) return null;

  return (
    <CompoundModal
      open={visible}
      onCancel={onClose}
      width={600}
      title={VIEW_MODAL.TITLE}
      description={record.studentName || VIEW_MODAL.NA}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-2 gap-8 rounded-[32px] bg-gray-50/50 p-6 border border-gray-100/50">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black tracking-widest text-muted/50 uppercase">
              {FORM.REPORT_DATE}
            </span>
            <span className="text-gray-900 text-sm font-black tracking-tight">
              {dayjs(record.dateReport).format(DAILY_REPORT_UI.DATE_FORMAT)}
            </span>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] font-black tracking-widest text-muted/50 uppercase">
              {TABLE.STATUS}
            </span>
            <LogbookStatusTag status={record.status} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
              {FORM.SUMMARY}
            </span>
            <div className="bg-white/50 backdrop-blur-sm border-gray-100 rounded-[24px] border p-6 shadow-sm group hover:border-primary/30 transition-all duration-300">
              <p className="text-gray-700 text-[15px] font-bold leading-relaxed tracking-tight">
                {record.summary || VIEW_MODAL.NO_SUMMARY}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black tracking-[0.2em] text-rose-500 uppercase">
                {FORM.ISSUE}
              </span>
              <div className="bg-rose-50/30 border-rose-100/50 rounded-[24px] border p-5 shadow-sm group hover:border-rose-200 transition-all duration-300 h-full">
                <p className="text-rose-900/70 text-[14px] font-bold leading-relaxed tracking-tight italic">
                  {record.issue || VIEW_MODAL.NO_ISSUE}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                {FORM.PLAN}
              </span>
              <div className="bg-emerald-50/30 border-emerald-100/50 rounded-[24px] border p-5 shadow-sm group hover:border-emerald-200 transition-all duration-300 h-full">
                <p className="text-emerald-900/70 text-[14px] font-bold leading-relaxed tracking-tight">
                  {record.plan || VIEW_MODAL.NO_PLAN}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end border-t border-gray-50 pt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-11 rounded-full px-10 text-[11px] font-black uppercase tracking-widest transition-all hover:bg-gray-100"
          >
            {DAILY_REPORT_UI.MODAL.CANCEL}
          </Button>
        </div>
      </div>
    </CompoundModal>
  );
});

export default LogbookDetailModal;
