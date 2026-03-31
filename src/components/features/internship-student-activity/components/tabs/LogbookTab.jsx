'use client';

import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  DownOutlined,
  ExclamationCircleFilled,
  FileTextOutlined,
} from '@ant-design/icons';
import { Collapse, Empty } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import { UI_TEXT } from '@/lib/UI_Text';

export default function LogbookTab({ student, loading }) {
  const [activeWeeks, setActiveWeeks] = useState([]);

  const logbook = student?.activity || {};
  const weeks = student?.logbookWeeks || [];

  if (loading || !student) {
    return (
      <div className="p-32 text-center">
        <div className="inline-block size-12 border-[5px] border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in -mt-11 fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-8 rounded-[40px] border border-white shadow-2xl shadow-slate-200/40">
        <div className="space-y-3">
          <h2 className="text-xl font-black tracking-tight text-slate-800">{student.fullName}</h2>
          <div className="flex flex-wrap items-center gap-5 text-[9px] font-black uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <FileTextOutlined className="text-primary text-[10px] opacity-70" />
              <span>
                {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.TOTAL}{' '}
                <span className="text-slate-800 text-[11px]">
                  {logbook.submitted}/{logbook.totalWorkDays}
                </span>{' '}
                {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.REPORTS}
              </span>
            </div>
            <span className="opacity-20 hidden md:block">|</span>
            <span className="flex items-center gap-2.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <CalendarOutlined className="text-primary text-[10px] opacity-70" />
              {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.FROM}{' '}
              <span className="text-slate-800">{student.termStartDate}</span>{' '}
              {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.TO}{' '}
              <span className="text-slate-800">{student.termEndDate}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="px-1">
        {weeks.length > 0 ? (
          <Collapse
            ghost
            activeKey={activeWeeks}
            onChange={setActiveWeeks}
            expandIcon={({ isActive }) => (
              <div
                className={`size-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm transition-all duration-500 ${isActive ? 'rotate-180 bg-primary/5 border-primary/20 text-primary' : 'text-slate-400'}`}
              >
                <DownOutlined className="text-[9px]" />
              </div>
            )}
            expandIconPlacement="end"
            className="logbook-premium-collapse"
            items={weeks.map((week) => {
              const isFull = week.submittedCount === week.totalCount;
              return {
                key: week.weekNumber.toString(),
                className: 'mb-5 group',
                label: (
                  <div className="flex items-center gap-4 py-1">
                    <div
                      className={`size-9 rounded-xl shadow-sm flex items-center justify-center border-2 transition-transform duration-500 group-hover:scale-105 ${
                        isFull
                          ? 'bg-green-50 border-green-100 text-green-500 shadow-green-100/10'
                          : 'bg-yellow-50 border-yellow-100 text-yellow-500 shadow-yellow-100/10'
                      }`}
                    >
                      {isFull ? (
                        <CheckCircleFilled className="text-base" />
                      ) : (
                        <ExclamationCircleFilled className="text-base" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0 px-1">
                      <h3 className="text-[15px] font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                        {week.weekTitle ||
                          `${UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.WEEK} ${week.weekNumber}`}
                        {isFull && (
                          <Badge
                            variant="success-soft"
                            size="xs"
                            className="px-2 rounded-md text-[7px] tracking-[0.1em] font-black uppercase ring-1 ring-green-100"
                          >
                            {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.COMPLETED}
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter opacity-80">
                          {dayjs(week.weekStartDate).format('DD/MM/YYYY')} {UI_TEXT.COMMON.EM_DASH}{' '}
                          {dayjs(week.weekEndDate).format('DD/MM/YYYY')}
                        </span>
                        <span
                          className={`text-[8px] font-black uppercase tracking-widest ${isFull ? 'text-green-500' : 'text-yellow-600'}`}
                        >
                          {week.completionRatio} {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.REPORTS}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
                children: (
                  <div className="bg-white rounded-[28px] p-0.5 border border-white shadow-lg shadow-slate-200/10 overflow-hidden mt-0.5">
                    <div className="p-0.5 space-y-0">
                      {week.entries && week.entries.length > 0 ? (
                        week.entries.map((entry, eIdx) => (
                          <div key={eIdx} className="group/entry relative">
                            <div className="flex flex-col md:flex-row items-start gap-5 p-5 rounded-2xl bg-white border border-transparent hover:border-slate-50 hover:bg-slate-50/10 transition-all duration-300">
                              <div className="w-24 shrink-0">
                                <div className="flex flex-col gap-0">
                                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">
                                    {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.REPORT_DATE}
                                  </span>
                                  <span className="text-xs font-black text-slate-800 tracking-tight">
                                    {dayjs(entry.dateReport).format('dddd')}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400">
                                    {dayjs(entry.dateReport).format('DD/MM/YYYY')}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 space-y-2.5">
                                <div className="space-y-0.5">
                                  <span className="text-[7px] font-black uppercase tracking-[0.1em] text-primary/60">
                                    {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.WORK_SUMMARY}
                                  </span>
                                  <h5 className="text-[13px] font-black text-slate-800 tracking-tight leading-snug">
                                    {entry.summary ||
                                      UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.SUMMARY_UNAVAILABLE}
                                  </h5>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[7px] font-black uppercase tracking-[0.1em] text-slate-400">
                                    {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.NOTES_ISSUES}
                                  </span>
                                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                                    {entry.issue || UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.NO_ISSUES}
                                  </p>
                                </div>

                                {entry.plan && (
                                  <div className="mt-3 p-3 bg-primary/[0.03] rounded-xl border border-primary/[0.05] relative overflow-hidden group/plan">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/10" />
                                    <span className="text-[7px] font-black uppercase text-primary tracking-[0.1em] block mb-1 opacity-60">
                                      {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.NEXT_PLAN}
                                    </span>
                                    <p className="text-[10px] font-black text-slate-600 leading-relaxed italic opacity-90">
                                      {entry.plan}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="w-40 shrink-0 flex flex-col items-end gap-4 self-stretch justify-between">
                                <div className="flex flex-col items-end gap-2 text-right">
                                  <Badge
                                    variant={
                                      entry.status === 'PUNCTUAL' ||
                                      entry.statusBadge === 'Submitted'
                                        ? 'success-soft'
                                        : 'warning-soft'
                                    }
                                    size="xs"
                                    className="font-black tracking-widest uppercase px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-none ring-1 ring-slate-100/50"
                                  >
                                    <div
                                      className={`size-1.5 rounded-full ${entry.status === 'PUNCTUAL' ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    />
                                    <span className="text-[8px]">{entry.statusBadge}</span>
                                  </Badge>
                                  <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                                    <ClockCircleOutlined className="text-[10px]" />
                                    {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.SUBMITTED_AT}{' '}
                                    <span className="text-slate-400">
                                      {dayjs(entry.dateReport).format('HH:mm DD/MM')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mx-6 h-px bg-slate-50 group-last/entry:hidden" />
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100 m-4">
                          <Empty
                            description={
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-loose">
                                {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.NO_REPORTS_WEEK}
                              </span>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ),
              };
            })}
          />
        ) : (
          <div className="py-32 bg-white rounded-[44px] border border-white shadow-2xl flex flex-col items-center justify-center text-center px-10">
            <div className="size-24 rounded-[36px] bg-slate-50 flex items-center justify-center text-slate-200 text-5xl mb-8 border border-white shadow-inner">
              <FileTextOutlined />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
              {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.EMPTY}
            </h3>
            <p className="text-slate-400 font-semibold max-w-sm leading-relaxed">
              {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.NO_REPORTS}
            </p>
          </div>
        )}
      </div>

      {/* eslint-disable react/jsx-no-literals */}
      <style jsx global>{`
        .logbook-premium-collapse .ant-collapse-header {
          padding: 0 !important;
          align-items: center !important;
          cursor: pointer !important;
        }
        .logbook-premium-collapse .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
