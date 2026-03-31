'use client';

import { CommentOutlined, DownOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

export default function EvaluationsTab({ student, evaluations, loading }) {
  const [activeKeys, setActiveKeys] = useState(
    evaluations?.map((ev, index) => (ev.evaluationId || ev.id || index).toString()) || []
  );
  if (loading)
    return (
      <div className="p-24 text-center">
        <div className="inline-block size-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">
          {STUDENT_ACTIVITY_UI.EVALUATIONS.FETCHING}
        </div>
      </div>
    );

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-sm rounded-[32px] border border-white shadow-xl shadow-slate-200/20">
        <div className="size-16 rounded-[24px] bg-white flex items-center justify-center text-slate-200 text-3xl mb-4 shadow-sm border border-slate-100">
          <StarOutlined />
        </div>
        <p className="text-sm font-bold text-slate-400 tracking-tight uppercase px-12 text-center leading-tight italic">
          {STUDENT_ACTIVITY_UI.EVALUATIONS.NO_EVALS}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <Collapse
        activeKey={activeKeys}
        onChange={setActiveKeys}
        expandIcon={({ isActive }) => (
          <div
            className={`size-6 rounded-md bg-white flex items-center justify-center transition-all duration-500 shadow-sm border border-slate-100 ${isActive ? 'rotate-180 bg-primary/5 border-primary/20 text-primary' : 'text-slate-400'}`}
          >
            <DownOutlined className="text-[8px]" />
          </div>
        )}
        expandIconPlacement="end"
        className="activity-evaluation-collapse border-none bg-transparent"
        ghost
        items={evaluations.map((ev, i) => ({
          key: (ev.evaluationId || ev.id || i).toString(),
          className:
            'mb-4 bg-white/60 backdrop-blur-sm rounded-[24px] overflow-hidden border border-white shadow-lg shadow-slate-200/10 transition-all duration-500 hover:shadow-xl hover:border-primary/10 group',
          label: (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 w-full pr-3">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-white shadow-lg flex flex-col items-center justify-center text-primary border border-slate-50 group-hover:rotate-3 transition-transform duration-500">
                  <span className="text-base font-bold leading-none">{ev.totalScore || 0}</span>
                  <span className="text-[7px] font-bold uppercase text-slate-500 mt-1 tracking-tighter">
                    {STUDENT_ACTIVITY_UI.EVALUATIONS.SCORE}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-bold tracking-tight text-slate-800 leading-tight mb-1">
                    {ev.cycleName}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="primary-soft"
                      size="xs"
                      className="font-bold ring-1 ring-primary/10 text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-md"
                    >
                      {STUDENT_ACTIVITY_UI.EVALUATIONS.PUBLISHED}
                    </Badge>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-tight bg-slate-50/50 px-2 py-0.5 rounded-md border border-slate-100/30">
                      {dayjs(ev.cycleStartDate).format('DD/MM/YYYY')} {UI_TEXT.COMMON.EN_DASH}{' '}
                      {dayjs(ev.cycleEndDate).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="flex items-center gap-2 text-slate-600 font-extrabold text-[9px] bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white shadow-lg shadow-slate-200/10 whitespace-nowrap">
                  <div className="size-5 rounded bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                    <UserOutlined className="text-primary text-[8px]" />
                  </div>
                  <span className="tracking-tight italic">
                    {ev.evaluatorName || STUDENT_ACTIVITY_UI.EVALUATIONS.MENTOR}
                  </span>
                </div>
              </div>
            </div>
          ),
          children: (
            <div className="px-5 py-4 border-t border-slate-100/50 space-y-4 bg-slate-50/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ev.details &&
                  ev.details.map((d, j) => (
                    <div
                      key={j}
                      className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-white shadow-sm hover:shadow-md transition-all duration-300 group/criteria"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.1em] truncate">
                          {d.criteriaName}
                        </span>
                        <div className="size-6 rounded-md bg-primary/5 flex items-center justify-center text-primary font-bold text-[10px] shadow-inner group-hover/criteria:scale-110 transition-transform">
                          {d.score}
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-slate-50 rounded-full" />
                      <p className="text-[11px] font-bold text-slate-600 italic leading-snug">
                        &quot;{d.comment || STUDENT_ACTIVITY_UI.EVALUATIONS.NO_COMMENT}&quot;
                      </p>
                    </div>
                  ))}
              </div>

              <div className="relative p-4 rounded-2xl bg-white border border-primary/10 overflow-hidden shadow-lg shadow-primary/5 group/comment">
                <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CommentOutlined className="text-4xl text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                    <CommentOutlined className="text-xs" />
                  </div>
                  <h4 className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">
                    {STUDENT_ACTIVITY_UI.EVALUATIONS.GENERAL_FEEDBACK}
                  </h4>
                </div>
                <p className="text-xs font-bold text-slate-800 italic leading-relaxed relative z-10 pr-8">
                  &quot;
                  {ev.generalComment || STUDENT_ACTIVITY_UI.EVALUATIONS.NO_GENERAL_COMMENT}
                  &quot;
                </p>
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );
}
