'use client';

import { ExclamationCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React from 'react';

import Card from '@/components/ui/card';
import { UI_TEXT } from '@/lib/UI_Text';

const ViolationCard = ({ violation }) => {
  return (
    <Card className="animate-in fade-in slide-in-from-left-4 duration-500 !p-0 border-none shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-red-500/10 transition-all !rounded-[40px] bg-white overflow-hidden group border border-slate-100/30">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="flex flex-row md:flex-col items-center md:justify-center gap-6 shrink-0 px-10 py-10 bg-red-500 shadow-2xl shadow-red-500/20 text-white min-w-[200px] md:rounded-r-[48px] transform group-hover:scale-[1.02] transition-transform duration-700">
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/80 mb-2">
              {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.INCIDENT_DATE}
            </span>
            <span className="text-xl font-black tracking-tight leading-tight italic">
              {violation.occurredDate}
            </span>
          </div>
          <div className="h-[2px] w-12 bg-white/20 hidden md:block rounded-full shadow-inner" />
          <div className="flex flex-col items-center opacity-80 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/90 mb-2">
              {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.REPORT_DATE}
            </span>
            <span className="text-sm font-extrabold leading-tight tracking-tight">
              {violation.reportedAt ? dayjs(violation.reportedAt).format('DD/MM/YYYY') : '—'}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-10 gap-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              <div className="size-12 rounded-[22px] bg-red-100/50 flex items-center justify-center text-red-600 text-2xl shadow-inner border border-red-200/20 group-hover:rotate-12 transition-transform">
                <ExclamationCircleOutlined />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-2xl font-black tracking-tight text-slate-800 truncate">
                  {violation.internshipGroupName ||
                    UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.DISCIPLINARY_RECORD}
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500 mt-1">
                  {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.DISCIPLINARY_VIOLATION}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-50/80 px-4 py-2 rounded-full border border-slate-100 shrink-0">
              <HistoryOutlined className="text-slate-400" />{' '}
              {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.READ_ONLY_ARCHIVE}
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-0 h-full w-2 bg-red-100/30 rounded-full blur-[1px]" />
            <div className="pl-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.DESCRIPTION}
                </span>
              </div>
              <p className="text-lg font-black text-slate-700 leading-relaxed italic pr-8 opacity-90">
                &quot;{violation.description}&quot;
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-[11px] font-black text-slate-400 italic border-t border-slate-50 pt-6">
            <div className="px-3 py-1 bg-slate-50 rounded-md border border-slate-100 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-slate-300" />
              <span className="uppercase tracking-widest text-slate-500">
                {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.SYSTEM_SNAPSHOT}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function ViolationsTab({ violations, loading }) {
  if (loading)
    return (
      <div className="p-24 text-center">
        <div className="inline-block size-10 border-[5px] border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <div className="text-slate-600 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
          {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.LOADING}
        </div>
      </div>
    );

  if (!violations || violations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 bg-white/80 backdrop-blur-sm rounded-[48px] animate-in zoom-in-95 duration-1000 shadow-xl shadow-slate-200/40 border border-white">
        <div className="size-24 rounded-[36px] bg-slate-50 flex items-center justify-center text-slate-200 text-5xl mb-8 shadow-inner border border-slate-100/50">
          <HistoryOutlined />
        </div>
        <p className="text-2xl font-black text-slate-500 tracking-tight uppercase px-12 text-center leading-tight">
          {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.NO_RECORDS}
        </p>
        <span className="text-[11px] font-extrabold text-slate-300 mt-4 uppercase tracking-[0.2em] italic bg-slate-50/50 px-6 py-2 rounded-full border border-slate-50">
          {UI_TEXT.STUDENT_ACTIVITY.VIOLATIONS.CLEAR_HISTORY}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-2 pb-20">
      {violations.map((v, i) => (
        <ViolationCard key={v.id || i} violation={v} />
      ))}
    </div>
  );
}
