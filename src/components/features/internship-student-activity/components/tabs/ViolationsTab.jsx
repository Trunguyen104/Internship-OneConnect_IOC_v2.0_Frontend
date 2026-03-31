'use client';

import { ExclamationCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React from 'react';

import Card from '@/components/ui/card';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';

const ViolationCard = ({ violation }) => {
  return (
    <Card className="animate-in fade-in slide-in-from-left-4 duration-500 !p-0 border border-white shadow-lg shadow-slate-200/20 hover:shadow-xl transition-all !rounded-[24px] bg-white overflow-hidden group h-fit !min-h-0">
      <div className="flex flex-col md:flex-row md:items-stretch h-fit !min-h-0">
        {/* Date Section */}
        <div className="w-full md:w-44 shrink-0 bg-red-500 p-6 flex flex-col justify-center items-center text-white text-center gap-4 relative overflow-hidden group-hover:bg-red-600 transition-colors duration-500">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <ExclamationCircleOutlined className="text-4xl rotate-12" />
          </div>

          <div className="relative z-10">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 block mb-1">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.INCIDENT_DATE}
            </span>
            <span className="text-lg font-bold tracking-tight leading-none italic">
              {violation.occurredDate}
            </span>
          </div>

          <div className="w-8 h-px bg-white/20" />

          <div className="relative z-10">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 block mb-1">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.REPORT_DATE}
            </span>
            <span className="text-xs font-bold leading-none">
              {violation.reportedAt ? dayjs(violation.reportedAt).format('DD/MM/YYYY') : '—'}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl shadow-sm border border-red-100/50">
                <ExclamationCircleOutlined />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-base font-bold text-slate-800 tracking-tight truncate leading-tight">
                  {violation.internshipGroupName || STUDENT_ACTIVITY_UI.VIOLATIONS.SYSTEM_RECORD}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[8px] font-bold uppercase tracking-widest">
                    {STUDENT_ACTIVITY_UI.VIOLATIONS.DISCIPLINARY_VIOLATION}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 italic">
                    {STUDENT_ACTIVITY_UI.VIOLATIONS.SYSTEM_SNAPSHOT}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl relative group/desc">
            <div className="absolute top-4 left-0 w-1 h-8 bg-red-400/30 rounded-full" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {STUDENT_ACTIVITY_UI.VIOLATIONS.DETAILED_DESCRIPTION}
            </span>
            <p className="text-sm font-bold text-slate-700 leading-relaxed italic pr-4">
              &quot;{violation.description}&quot;
            </p>
          </div>

          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px]">
                {STUDENT_ACTIVITY_UI.VIOLATIONS.CREATED_BY}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                {violation.internshipGroupName || STUDENT_ACTIVITY_UI.VIOLATIONS.SYSTEM}
              </span>
            </div>
            <div className="size-1 bg-slate-200 rounded-full" />
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px]">
                {STUDENT_ACTIVITY_UI.VIOLATIONS.RECORD_ID}
              </span>
              <span className="text-slate-600 tracking-tighter">
                #{violation.violationReportId?.slice(0, 8)}
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
      <div className="flex flex-col items-center justify-center py-20 px-8 bg-white/50 backdrop-blur-sm rounded-[32px] animate-in zoom-in-95 duration-1000 shadow-xl shadow-slate-200/20 border border-white">
        <div className="size-16 rounded-[24px] bg-white flex items-center justify-center text-slate-200 text-3xl mb-6 shadow-sm border border-slate-100/50">
          <HistoryOutlined />
        </div>
        <h3 className="text-lg font-bold text-slate-400 tracking-tight uppercase px-12 text-center leading-tight">
          {STUDENT_ACTIVITY_UI.VIOLATIONS.NO_VIOLATIONS_MATCH}
        </h3>
        <span className="text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-[0.2em] italic bg-white px-6 py-2 rounded-full border border-slate-50">
          {STUDENT_ACTIVITY_UI.VIOLATIONS.CLEAN_HISTORY}
        </span>
      </div>
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
