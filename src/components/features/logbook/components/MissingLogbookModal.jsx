'use client';

import { CalendarOutlined, PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
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
    <CompoundModal
      open={visible}
      onCancel={onClose}
      width={500}
      title={MISSING_MODAL.TITLE}
      description={MISSING_MODAL.DESCRIPTION}
      icon={<WarningOutlined className="text-amber-500" />}
      footer={null}
    >
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted/50 pb-2 border-b border-gray-50">
          <CalendarOutlined />
          <span>{MISSING_MODAL.LIST_TITLE}</span>
          <span className="ml-auto bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px]">
            {missingDates.length} {MISSING_MODAL.DAYS_SUFFIX}
          </span>
        </div>

        <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {missingDates.map((dateStr) => {
              const d = dayjs(dateStr);
              return (
                <div
                  key={dateStr}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group hover:border-amber-200 hover:bg-amber-50 transition-all duration-300"
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-700">
                      {d.format('DD/MM/YYYY')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {d.format('dddd')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => {
              onCreateReport(missingDates[0]);
              onClose();
            }}
            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircleOutlined className="text-lg" />
            {MISSING_MODAL.CREATE_NOW}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-gray-100 transition-all text-slate-400"
          >
            {MISSING_MODAL.LATER}
          </Button>
        </div>
      </div>
    </CompoundModal>
  );
});

export default MissingLogbookModal;
