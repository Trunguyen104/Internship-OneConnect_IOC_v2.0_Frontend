import { ExclamationCircleOutlined, FieldTimeOutlined, HistoryOutlined } from '@ant-design/icons';
import React from 'react';

import Card from '@/components/ui/card';
import { STUDENT_ACTIVITY_UI } from '../../constants/student-activity.constants';

const ViolationCard = ({ violation }) => {
  const { DETAIL } = STUDENT_ACTIVITY_UI;
  return (
    <Card className="animate-in fade-in slide-in-from-left-4 duration-500 !p-0 border-none shadow-sm hover:shadow-xl transition-all !rounded-[32px] bg-white overflow-hidden group border border-slate-100/50">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Date Section - Side Column */}
        <div className="flex flex-row md:flex-col items-center md:justify-center gap-4 shrink-0 px-8 py-6 bg-error shadow-inner text-white min-w-[180px] md:rounded-r-[40px] transform group-hover:scale-105 transition-transform duration-500">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{DETAIL.VIOLATION.INCIDENT_DATE}</span>
            <span className="text-lg font-black tracking-tight">{violation.incidentDate}</span>
          </div>
          <div className="h-[1px] w-12 bg-white/20 hidden md:block" />
          <div className="flex flex-col items-center opacity-70">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{DETAIL.VIOLATION.REPORT_DATE}</span>
            <span className="text-xs font-bold">{violation.createdAt}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-8 gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-error/10 flex items-center justify-center text-error text-xl animate-pulse shadow-inner">
                <ExclamationCircleOutlined />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-800">
                  {violation.violationType || violation.type}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-error/40 mt-0.5">Disciplinary Report</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
               <HistoryOutlined /> Read-only Record
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-error/10 rounded-full" />
            <div className="pl-6 space-y-3">
              <div className="flex items-center gap-2 opacity-40">
                <FieldTimeOutlined className="text-xs" />
                <span className="text-[10px] font-black uppercase tracking-widest">{DETAIL.VIOLATION.DESCRIPTION}</span>
              </div>
              <p className="text-base font-medium text-slate-600 leading-relaxed italic pr-4">
                "{violation.description}"
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-slate-400 italic border-t border-slate-50 pt-4">
             <span className="size-1.5 rounded-full bg-slate-200" />
             Snapshot data from enterprise disciplinary management systems.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function ViolationsTab({ violations, loading }) {
  if (loading) return <div className="p-12 text-center text-slate-400 font-bold italic animate-pulse">Loading violation reports...</div>;

  if (!violations || violations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] animate-in zoom-in-95 duration-700 shadow-sm border border-slate-100/50">
        <div className="size-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-200 text-4xl mb-6 shadow-inner">
           <HistoryOutlined />
        </div>
        <p className="text-xl font-black text-slate-400 tracking-tight uppercase px-8 text-center">
          {STUDENT_ACTIVITY_UI.DETAIL.OVERVIEW.NO_VIOLATION}
        </p>
        <span className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest italic">Clean disciplinary record</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-1 pb-12">
      {violations.map((v, i) => (
        <ViolationCard key={v.id || i} violation={v} />
      ))}
    </div>
  );
}
