'use client';

import {
  CheckCircleFilled,
  ClockCircleOutlined,
  DownOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { Collapse, Empty } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

export default function LogbookTab({ student, weeks: propWeeks, loading }) {
  const [activeWeeks, setActiveWeeks] = useState([]);

  const weeks = propWeeks || student?.logbookWeeks || [];

  if (loading || !student) {
    return (
      <div className="p-32 text-center bg-white/50 backdrop-blur-sm rounded-[32px] border border-white/50">
        <div className="inline-block size-12 border-[5px] border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">
          {UI_TEXT.COMMON.LOADING}
        </div>
      </div>
    );
  }

  if (!weeks || weeks.length === 0) {
    return (
      <div className="py-32 bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/40">
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description={
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-slate-400 uppercase tracking-tight">
                {STUDENT_ACTIVITY_UI.LOGBOOK.EMPTY}
              </span>
              <span className="text-[10px] text-slate-400 italic font-medium">
                {STUDENT_ACTIVITY_UI.LOGBOOK.NO_REPORTS}
              </span>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <Collapse
        ghost
        activeKey={activeWeeks}
        onChange={setActiveWeeks}
        expandIcon={({ isActive }) => (
          <div
            className={`size-7 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm transition-all duration-500 ${isActive ? 'rotate-180 bg-primary/5 border-primary/20 text-primary' : 'text-slate-400'}`}
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
            className:
              'mb-2.5 group bg-white/60 backdrop-blur-sm rounded-xl border border-white shadow-md shadow-slate-200/5 overflow-hidden transition-all duration-300 hover:bg-white',
            label: (
              <div className="flex items-center gap-4 py-2 px-4">
                <div
                  className={`size-8 rounded-lg shadow-sm flex items-center justify-center border-2 transition-transform duration-500 group-hover:scale-105 ${
                    isFull
                      ? 'bg-green-50 border-green-100 text-green-500'
                      : 'bg-yellow-50 border-yellow-100 text-yellow-500'
                  }`}
                >
                  {isFull ? (
                    <CheckCircleFilled className="text-sm" />
                  ) : (
                    <ExclamationCircleFilled className="text-sm" />
                  )}
                </div>
                <div className="flex flex-col gap-0">
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    {week.weekTitle ||
                      `${UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.WEEK} ${week.weekNumber}`}
                    {isFull && (
                      <Badge
                        variant="success-soft"
                        size="xs"
                        className="px-1.5 rounded-md text-[7px] tracking-[0.05em] font-bold uppercase ring-1 ring-green-100"
                      >
                        {STUDENT_ACTIVITY_UI.LOGBOOK.COMPLETED}
                      </Badge>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter opacity-80">
                      {dayjs(week.weekStartDate).format('DD/MM/YYYY')} {UI_TEXT.COMMON.EM_DASH}{' '}
                      {dayjs(week.weekEndDate).format('DD/MM/YYYY')}
                    </span>
                    <div className="size-0.5 bg-slate-200 rounded-full" />
                    <span
                      className={`text-[8px] font-bold uppercase tracking-widest ${isFull ? 'text-green-500' : 'text-yellow-600'}`}
                    >
                      {week.completionRatio} {STUDENT_ACTIVITY_UI.LOGBOOK.REPORTS}
                    </span>
                  </div>
                </div>
              </div>
            ),
            children: (
              <div className="px-4 pb-4">
                <div className="bg-slate-50/50 rounded-xl border border-slate-100/50 p-1.5 space-y-1.5 mt-1.5">
                  {week.entries &&
                    week.entries.length > 0 &&
                    week.entries.map((entry, eIdx) => (
                      <div
                        key={eIdx}
                        className="group/entry bg-white rounded-xl border border-white shadow-sm p-3 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row items-start gap-4">
                          <div className="w-20 shrink-0">
                            <div className="flex flex-col gap-0 border-r border-slate-100 pr-3">
                              <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                {STUDENT_ACTIVITY_UI.LOGBOOK.REPORT_DATE}
                              </span>
                              <span className="text-[12px] font-black text-slate-800 tracking-tight leading-none uppercase">
                                {dayjs(entry.dateReport).format('dddd')}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 mt-1 opacity-70">
                                {dayjs(entry.dateReport).format('DD/MM/YYYY')}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="space-y-0.5">
                              <span className="text-[7px] font-black uppercase tracking-[0.1em] text-primary/60">
                                {STUDENT_ACTIVITY_UI.LOGBOOK.WORK_SUMMARY}
                              </span>
                              <h5 className="text-[13px] font-bold text-slate-800 tracking-tight leading-tight">
                                {entry.summary || STUDENT_ACTIVITY_UI.LOGBOOK.SUMMARY_UNAVAILABLE}
                              </h5>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[7px] font-black uppercase tracking-[0.1em] text-slate-400">
                                {STUDENT_ACTIVITY_UI.LOGBOOK.NOTES_ISSUES}
                              </span>
                              <p className="text-[11px] text-slate-500 leading-snug font-bold italic">
                                {entry.issue || STUDENT_ACTIVITY_UI.LOGBOOK.NO_ISSUES}
                              </p>
                            </div>

                            {entry.plan && (
                              <div className="p-2 bg-primary/[0.03] rounded-xl border border-primary/[0.05] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                <span className="text-[7px] font-black uppercase text-primary tracking-[0.1em] block mb-1">
                                  {STUDENT_ACTIVITY_UI.LOGBOOK.NEXT_PLAN}
                                </span>
                                <p className="text-[10px] font-bold text-slate-600 leading-snug italic pr-4">
                                  {entry.plan}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="w-36 shrink-0 flex flex-col items-end gap-2">
                            <Badge
                              variant={
                                entry.status === 'PUNCTUAL' ||
                                entry.statusBadge ===
                                  STUDENT_ACTIVITY_UI.MAPPING.STATUS.SUBMITTED ||
                                entry.statusBadge === STUDENT_ACTIVITY_UI.MAPPING.STATUS.PUNCTUAL_VN
                                  ? 'success-soft'
                                  : 'warning-soft'
                              }
                              size="xs"
                              className="font-black tracking-widest uppercase px-2 py-1 rounded-lg flex items-center gap-1.5 ring-1 ring-slate-100/30"
                            >
                              <div
                                className={`size-1.5 rounded-full ${
                                  entry.status === 'PUNCTUAL' ||
                                  entry.statusBadge ===
                                    STUDENT_ACTIVITY_UI.MAPPING.STATUS.PUNCTUAL_VN
                                    ? 'bg-green-500'
                                    : 'bg-yellow-500'
                                }`}
                              />
                              <span className="text-[7px]">
                                {entry.status === 'PUNCTUAL' ||
                                entry.statusBadge === STUDENT_ACTIVITY_UI.MAPPING.STATUS.PUNCTUAL_VN
                                  ? STUDENT_ACTIVITY_UI.LOGBOOK.PUNCTUAL
                                  : entry.status === 'LATE' ||
                                      entry.statusBadge ===
                                        STUDENT_ACTIVITY_UI.MAPPING.STATUS.LATE_VN
                                    ? STUDENT_ACTIVITY_UI.LOGBOOK.LATE
                                    : STUDENT_ACTIVITY_UI.LOGBOOK.NOT_SUBMITTED}
                              </span>
                            </Badge>
                            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                              <ClockCircleOutlined className="text-[9px]" />
                              {STUDENT_ACTIVITY_UI.LOGBOOK.SUBMITTED_AT}{' '}
                              <span className="text-slate-500">
                                {dayjs(entry.dateReport).format('HH:mm DD/MM')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {week.entries && week.entries.length === 0 && (
                    <div className="py-12 text-center bg-white/50 rounded-xl border border-white">
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                            {STUDENT_ACTIVITY_UI.LOGBOOK.NO_REPORTS_WEEK}
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
    </div>
  );
}
