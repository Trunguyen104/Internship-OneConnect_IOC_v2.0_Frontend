'use client';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import Card from '@/components/ui/card';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

const ViolationCard = ({ violation }) => {
  return (
    <Card className="animate-in fade-in slide-in-from-left-4 duration-500 !p-0 border border-white shadow-lg shadow-slate-200/20 hover:shadow-xl transition-all !rounded-[24px] bg-white overflow-hidden group h-fit !min-h-0">
      <div className="flex flex-col md:flex-row md:items-stretch h-fit !min-h-0">
        {/* Date Section */}
        <div className="w-full md:w-32 shrink-0 bg-red-500 p-4 flex flex-col justify-center items-center text-white text-center gap-2 relative overflow-hidden group-hover:bg-red-600 transition-colors duration-500">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <ExclamationCircleOutlined className="text-2xl rotate-12" />
          </div>

          <div className="relative z-10">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/70 block mb-0.5">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.INCIDENT_DATE}
            </span>
            <span className="text-sm font-black tracking-tight leading-none italic">
              {violation.occurredDate}
            </span>
          </div>

          <div className="w-6 h-px bg-white/20" />

          <div className="relative z-10">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/70 block mb-0.5">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.REPORT_DATE}
            </span>
            <span className="text-[10px] font-black leading-none">
              {violation.reportedAt
                ? dayjs(violation.reportedAt).format('DD/MM/YYYY')
                : UI_TEXT.COMMON.EMPTY_VALUE}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-lg shadow-sm border border-red-100/50">
                <ExclamationCircleOutlined />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-sm font-black text-slate-800 tracking-tight truncate leading-tight">
                  {violation.internshipGroupName || STUDENT_ACTIVITY_UI.VIOLATIONS.SYSTEM_RECORD}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[7px] font-black uppercase tracking-widest leading-none">
                    {STUDENT_ACTIVITY_UI.VIOLATIONS.DISCIPLINARY_VIOLATION}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 italic leading-none">
                    {STUDENT_ACTIVITY_UI.VIOLATIONS.SYSTEM_SNAPSHOT}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl relative group/desc">
            <div className="absolute top-3 left-0 w-1 h-6 bg-red-400/30 rounded-full" />
            <span className="text-[7px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.DETAILED_DESCRIPTION}
            </span>
            <p className="text-[12px] font-bold text-slate-700 leading-snug italic pr-4">
              &quot;{violation.description}&quot;
            </p>
          </div>

          <div className="flex items-center gap-3 text-[8px] font-black text-slate-400 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[9px]">
                {STUDENT_ACTIVITY_UI.VIOLATIONS.CREATED_BY}
              </span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                {violation.internshipGroupName || STUDENT_ACTIVITY_UI.VIOLATIONS.SYSTEM}
              </span>
            </div>
            <div className="size-0.5 bg-slate-200 rounded-full" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[9px]">
                {STUDENT_ACTIVITY_UI.VIOLATIONS.RECORD_ID}
              </span>
              <span className="text-slate-600 tracking-tighter">
                {violation.violationReportId
                  ? `${UI_TEXT.COMMON.ID_PREFIX}${violation.violationReportId.slice(0, 8)}`
                  : UI_TEXT.COMMON.EMPTY_VALUE}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function ViolationsTab({ student, violations, loading }) {
  if (loading)
    return (
      <div className="p-24 text-center">
        <div className="inline-block size-10 border-[5px] border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <div className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
          {STUDENT_ACTIVITY_UI.VIOLATIONS.LOADING}
        </div>
      </div>
    );

  if (!violations || violations.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_DEFAULT}
        description={
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-slate-400 uppercase tracking-tight">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.NO_VIOLATIONS_MATCH}
            </span>
            <span className="text-[10px] text-slate-400 italic font-medium">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.CLEAN_HISTORY}
            </span>
          </div>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {violations.map((v, i) => (
        <ViolationCard key={v.violationReportId || i} violation={v} />
      ))}
    </div>
  );
}
