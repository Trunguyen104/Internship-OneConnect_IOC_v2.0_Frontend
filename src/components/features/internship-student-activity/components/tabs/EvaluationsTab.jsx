import { CommentOutlined, DownOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';

import Badge from '@/components/ui/badge';

import { STUDENT_ACTIVITY_UI } from '../../constants/student-activity.constants';

const { Panel } = Collapse;

export default function EvaluationsTab({ evaluations, loading }) {
  if (loading) return <div className="p-12 text-center text-slate-400 font-bold italic animate-pulse">Fetching evaluation records...</div>;

  const publishedEvaluations = (evaluations || []).filter(ev => ev.status === 3 || ev.status === 'Published');

  if (publishedEvaluations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] animate-in zoom-in-95 duration-700 shadow-sm border border-slate-100/50">
        <div className="size-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-200 text-4xl mb-6 shadow-inner">
          <StarOutlined />
        </div>
        <p className="text-xl font-black text-slate-400 tracking-tight uppercase px-8 text-center">
          {STUDENT_ACTIVITY_UI.DETAIL.OVERVIEW.NO_EVALUATION}
        </p>
        <span className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest italic">Waiting for mentor publication</span>
      </div>
    );
  }

  const { EVALUATION } = STUDENT_ACTIVITY_UI.DETAIL;

  return (
    <div className="flex flex-col gap-6 p-1 pb-12">
      <Collapse
        accordion
        expandIcon={({ isActive }) => (
          <div className={`size-8 rounded-full bg-slate-50 flex items-center justify-center transition-all duration-500 border border-slate-100 ${isActive ? 'rotate-180 bg-primary/10 border-primary/20 text-primary' : 'text-slate-400'}`}>
            <DownOutlined className="text-[10px]" />
          </div>
        )}
        expandIconPosition="end"
        className="activity-evaluation-collapse border-none bg-transparent"
        ghost
      >
        {publishedEvaluations.map((ev, i) => (
          <Panel
            key={ev.id || i}
            header={
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full pr-4 group">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-[20px] bg-white shadow-lg flex flex-col items-center justify-center text-primary border border-slate-50 group-hover:scale-110 transition-transform">
                    <span className="text-xl font-black leading-none">{ev.totalScore || 0}</span>
                    <span className="text-[8px] font-black uppercase opacity-40">Score</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-lg font-black tracking-tight text-slate-800 leading-tight">{ev.cycleName}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary-soft" size="xs" className="font-black ring-1 ring-primary/10 text-[9px] uppercase tracking-widest">
                        Published
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-60">
                         {ev.startDate} – {ev.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="flex items-center gap-2.5 text-slate-500 font-bold text-[11px] bg-slate-50/80 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm whitespace-nowrap">
                    <div className="size-6 rounded-lg bg-white flex items-center justify-center shadow-inner">
                      <UserOutlined className="text-primary text-[10px]" />
                    </div>
                    <span className="tracking-tight italic">{ev.evaluatorName || 'Mentor'}</span>
                  </div>
                </div>
              </div>
            }
            className="mb-8 bg-white rounded-[32px] overflow-hidden border border-slate-100/50 shadow-sm transition-all hover:shadow-xl hover:border-primary/10 animate-in slide-in-from-bottom-4 duration-500 group"
          >
            <div className="px-8 py-8 border-t border-slate-50 space-y-8 bg-gradient-to-b from-slate-50/30 to-white">
              {/* Score breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ev.criteria && ev.criteria.map((c, j) => (
                  <div key={j} className="flex flex-col gap-3 p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:ring-1 hover:ring-primary/20 transition-all group/criteria">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest truncate">{c.name}</span>
                      <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm shadow-inner group-hover/criteria:scale-110 transition-transform">
                         {c.score}
                      </div>
                    </div>
                    <div className="h-[1px] w-full bg-slate-50" />
                    <p className="text-[11px] font-semibold text-slate-400 italic leading-snug">
                      "{c.comment || 'Không có nhận xét chi tiết cho tiêu chí này.'}"
                    </p>
                  </div>
                ))}
              </div>

              {/* General Comment */}
              <div className="relative p-8 rounded-[32px] bg-primary/5 border border-primary/20 overflow-hidden group/comment">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/comment:opacity-20 transition-opacity">
                   <CommentOutlined className="text-6xl text-primary" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <CommentOutlined className="text-sm" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60">{EVALUATION.COMMENT}</span>
                </div>
                <p className="text-base font-black text-slate-800 italic leading-relaxed relative z-10">
                  "{ev.generalComment || 'Chưa có nhận xét tổng quát cho chu kỳ này.'}"
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-4">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{EVALUATION.EVALUATOR}:</span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{ev.evaluatorName}</span>
                   </div>
                   <span className="text-[9px] font-bold text-slate-300 italic">Snapshot tại thời điểm công bố</span>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </Collapse>
      
      <style jsx global>{`
        .activity-evaluation-collapse .ant-collapse-item {
          border: none !important;
        }
        .activity-evaluation-collapse .ant-collapse-header {
          padding: 24px 32px !important;
          align-items: center !important;
        }
        .activity-evaluation-collapse .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
