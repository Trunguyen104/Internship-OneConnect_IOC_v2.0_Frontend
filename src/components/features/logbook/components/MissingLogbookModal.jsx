'use client';

import { CalendarOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const MissingLogbookModal = memo(function MissingLogbookModal({
  visible,
  missingDates = [],
  onClose,
  onCreateReport,
}) {
  const { MISSING_MODAL } = DAILY_REPORT_UI;

  if (!missingDates || missingDates.length === 0) return null;

  return (
    <CompoundModal open={visible} onCancel={onClose} width={500}>
      <CompoundModal.Header
        title={MISSING_MODAL.TITLE}
        subtitle={MISSING_MODAL.DESCRIPTION}
        icon={<WarningOutlined />}
        type="warning"
      />

      <div className="mt-6 flex flex-col gap-4">
        {/* Banner */}
        <div className="flex items-center justify-between p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-sm tracking-tight">
            <CalendarOutlined className="text-lg" />
            <span>{MISSING_MODAL.LIST_TITLE}</span>
          </div>
          <span className="bg-amber-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-md shadow-amber-500/20">
            {missingDates.length} {MISSING_MODAL.DAYS_SUFFIX}
          </span>
        </div>

        {/* List of dates */}
        <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar my-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {missingDates.map((dateStr) => {
              const d = dayjs(dateStr);
              return (
                <div
                  key={dateStr}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors">
                      {d.format('DD/MM/YYYY')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium mt-0.5">
                      {d.format('dddd')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-5 mt-2 border-t border-gray-50 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-11 px-6 rounded-full font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            {MISSING_MODAL.LATER}
          </Button>
          <Button
            onClick={() => {
              onCreateReport(missingDates[0]);
              onClose();
            }}
            className="h-11 px-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-0"
          >
            {MISSING_MODAL.CREATE_NOW}
          </Button>
        </div>
      </div>
    </CompoundModal>
  );
});

export default MissingLogbookModal;
