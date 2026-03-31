'use client';

import { CommentOutlined, DownOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import Badge from '@/components/ui/badge';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

export default function EvaluationsTab({ evaluations, loading }) {
  const [activeKeys, setActiveKeys] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (evaluations.length > 0 && !hasInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveKeys(evaluations.map((ev, index) => (ev.evaluationId || ev.id || index).toString()));
      setHasInitialized(true);
    }
  }, [evaluations, hasInitialized]);

  if (loading)
    return (
      <div className="p-24 text-center">
        <div className="inline-block size-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <div className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] animate-pulse">
          {STUDENT_ACTIVITY_UI.EVALUATIONS.FETCHING}
        </div>
      </div>
    );

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white/80 backdrop-blur-sm rounded-[32px] animate-in zoom-in-95 duration-1000 shadow-xl shadow-slate-200/40 border border-white mt-[-40px]">
        <div className="size-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-200 text-3xl mb-4 shadow-inner border border-slate-100/50">
          <StarOutlined />
        </div>
        <p className="text-base font-black text-slate-400 tracking-tight uppercase px-12 text-center leading-tight">
          {STUDENT_ACTIVITY_UI.EVALUATIONS.NO_EVALS}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-12 animate-in -mt-4 fade-in slide-in-from-bottom-4 duration-700">
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
            'mb-3 bg-white rounded-[24px] overflow-hidden border border-white shadow-lg shadow-slate-200/20 transition-all duration-500 hover:shadow-xl hover:border-primary/10 group',
          label: (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 w-full pr-3 group">
              <div className="flex items-center gap-4">
                <div className="size-9 rounded-lg bg-white shadow-lg flex flex-col items-center justify-center text-primary border border-slate-50 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500">
                  <span className="text-sm font-black leading-none">{ev.totalScore || 0}</span>
                  <span className="text-[6px] font-black uppercase text-slate-500 mt-0.5 tracking-tighter">
                    {STUDENT_ACTIVITY_UI.EVALUATIONS.SCORE}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black tracking-tight text-slate-800 leading-tight mb-1">
                    {ev.cycleName}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="primary-soft"
                      size="xs"
                      className="font-black ring-1 ring-primary/10 text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm"
                    >
                      {STUDENT_ACTIVITY_UI.EVALUATIONS.PUBLISHED}
                    </Badge>
                    <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-tight bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                      {dayjs(ev.cycleStartDate).format('DD/MM/YYYY')} {UI_TEXT.COMMON.EN_DASH}{' '}
                      {dayjs(ev.cycleEndDate).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="flex items-center gap-2 text-slate-600 font-extrabold text-[9px] bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white shadow-lg shadow-slate-100/30 whitespace-nowrap group-hover:bg-white transition-all">
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
            <div className="px-5 py-4 border-t border-slate-50 space-y-4 bg-gradient-to-b from-slate-50/10 to-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ev.details &&
                  ev.details.map((d, j) => (
                    <div
                      key={j}
                      className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group/criteria"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.1em] truncate">
                          {d.criteriaName}
                        </span>
                        <div className="size-6 rounded-md bg-primary/5 flex items-center justify-center text-primary font-black text-[10px] shadow-inner group-hover/criteria:scale-110 transition-transform">
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

              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/20 overflow-hidden group/comment shadow-xl shadow-primary/5">
                <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl opacity-50 group-hover/comment:scale-150 transition-transform duration-1000" />
                <div className="absolute top-0 right-0 p-5 opacity-10 group-hover/comment:opacity-20 transition-opacity">
                  <CommentOutlined className="text-4xl text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 group-hover/comment:rotate-6 transition-transform">
                    <CommentOutlined className="text-xs" />
                  </div>
                  <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">
                    {STUDENT_ACTIVITY_UI.EVALUATIONS.GENERAL_FEEDBACK}
                  </h4>
                </div>
                <p className="text-xs font-bold text-slate-800 italic leading-relaxed relative z-10 pr-8">
                  &quot;
                  {ev.generalComment || STUDENT_ACTIVITY_UI.EVALUATIONS.NO_GENERAL_COMMENT}
                  &quot;
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">
                      {STUDENT_ACTIVITY_UI.EVALUATIONS.EVALUATED_BY}
                    </span>
                    <span className="px-2 py-0.5 bg-primary/10 rounded-md text-[8px] font-black text-primary uppercase tracking-tighter shadow-sm">
                      {ev.evaluatorName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
        }))}
      />
      {/* eslint-disable react/jsx-no-literals */}
      <style jsx global>{`
        .activity-evaluation-collapse .ant-collapse-item {
          border: none !important;
        }
        .activity-evaluation-collapse .ant-collapse-header {
          padding: 12px 20px !important;
          align-items: center !important;
        }
        .activity-evaluation-collapse .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
