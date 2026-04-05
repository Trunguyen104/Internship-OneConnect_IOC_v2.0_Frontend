import { BlockOutlined, InfoCircleOutlined, ProjectOutlined } from '@ant-design/icons';
import React from 'react';

import Card from '@/components/ui/card';
import StatusBadge from '@/components/ui/status-badge';
import { GROUP_STATUS_VARIANTS } from '@/constants/internship-management/internship-management';

export const GroupDetailOverview = ({ info, VIEW, GROUP_MANAGEMENT, onAssignMentor }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Detail Column (Left) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="!p-6 border-none shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <BlockOutlined />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-text/80 mb-0">
                {VIEW.TITLE}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                {VIEW.GROUP_NAME}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center">
                {info.groupName || '-'}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                {VIEW.STATUS}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm min-h-[44px] flex items-center">
                <StatusBadge
                  variant={GROUP_STATUS_VARIANTS[info.status] || 'neutral'}
                  label={GROUP_MANAGEMENT.STATUS.LABELS[info.status] || info.status || '-'}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                {VIEW.MENTOR}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center justify-between group">
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate">{info.mentorName || VIEW.NOT_ASSIGNED}</span>
                  {info.mentorEmail && (
                    <span className="text-[10px] text-muted/60 font-medium truncate">
                      {info.mentorEmail}
                    </span>
                  )}
                </div>

                {info.status === 1 && (
                  <button
                    onClick={() => onAssignMentor && onAssignMentor({ open: true, group: info })}
                    className="ml-2 flex h-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 px-3 text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 cursor-pointer"
                  >
                    {info.mentorName && info.mentorName !== '-' ? 'Change' : 'Assign'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                {VIEW.PROJECT_NAME}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center">
                <div className="flex items-center gap-2">
                  <ProjectOutlined className="text-primary/40" />
                  <span className="truncate flex items-center gap-2">
                    {info.projectName || GROUP_MANAGEMENT.TABLE.NOT_ASSIGNED}
                    {info.projectCount > 1 && (
                      <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full border border-primary/20 whitespace-nowrap">
                        +{info.projectCount - 1} {GROUP_MANAGEMENT.TABLE.MORE}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                {VIEW.ENTERPRISE}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center text-xs truncate">
                {info.enterpriseName || '-'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Column (Right) */}
      <div className="flex flex-col gap-6">
        <Card className="!p-6 border-none shadow-sm flex flex-col gap-4 h-full">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
              <InfoCircleOutlined />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-text/80 mb-0">
              {VIEW.DESCRIPTION}
            </h3>
          </div>
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-xs font-medium leading-relaxed text-muted flex-1 min-h-[150px]">
            {info.description || info.projectDescription || VIEW.NOT_ASSIGNED}
          </div>
        </Card>
      </div>
    </div>
  );
};
