import { Tooltip } from 'antd';
import { Calendar, MapPin } from 'lucide-react';
import React from 'react';

import { Card } from '@/components/ui/atoms';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';

export default function JobCard({ job, onClick, eligibility }) {
  const { title, enterprise, location, deadline, salary, type } = job;
  const [logoError, setLogoError] = React.useState(false);

  return (
    <div onClick={() => onClick?.(job.jobId)} className="h-full">
      <Card className="h-full group cursor-pointer hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-white relative overflow-hidden">
        {/* Status Tag - AC-01 Requirement */}
        <div className="absolute top-0 right-0 z-20">
          <div
            className={`${job.status === 2 ? 'bg-danger shadow-danger/20' : 'bg-success shadow-success/20'} text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm`}
          >
            {job.statusLabel}
          </div>
        </div>

        <div className="p-5 flex flex-col h-full relative z-10">
          <div className="flex items-start gap-3.5 mb-1.5">
            {/* Company Logo - Balanced Size */}
            <div className="h-14 w-14 rounded-xl bg-bg border border-border/40 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              {enterprise?.logoUrl && !logoError ? (
                <img
                  src={enterprise.logoUrl}
                  alt={enterprise.fullName}
                  className="h-full w-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="text-primary font-bold text-xl">{enterprise?.fullName?.[0]}</div>
              )}
            </div>

            <div className="flex-1 min-w-0 py-0.5">
              <h3 className="text-lg font-bold text-text truncate group-hover:text-primary transition-colors leading-tight pr-8">
                {title}
              </h3>
              <p className="text-[12px] font-bold text-muted/80 truncate mt-0.5 tracking-tight">
                {enterprise?.fullName}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              {type || EXPLORE_JOBS_UI.CARD.TYPE_FALLBACK}
            </span>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              {job.position || EXPLORE_JOBS_UI.DETAIL.ROLE_BADGE_FALLBACK}
            </span>
            <span className="bg-success/5 text-success text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              {salary || EXPLORE_JOBS_UI.CARD.SALARY_FALLBACK}
            </span>
          </div>

          <div className="mt-auto pt-5 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted text-[10px] font-bold uppercase tracking-widest opacity-80">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location || EXPLORE_JOBS_UI.CARD.LOCATION_FALLBACK}</span>
            </div>
            <div className="flex items-center gap-1.5 text-danger font-bold text-[10px] uppercase tracking-widest">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {EXPLORE_JOBS_UI.CARD.DEADLINE_LABEL}:{' '}
                {deadline || EXPLORE_JOBS_UI.CARD.NOT_AVAILABLE}
              </span>
            </div>
          </div>

          {/* Apply Button Section - AC-03 Requirement */}
          <div className="mt-4 pt-4 border-t border-border/20">
            <Tooltip
              title={!eligibility?.eligible ? eligibility?.reason : ''}
              placement="top"
              className="w-full"
            >
              <div className="w-full">
                <button
                  disabled={!eligibility?.eligible}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (eligibility?.eligible) {
                      onClick?.(job.jobId, true);
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 ${
                    eligibility?.eligible
                      ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                      : eligibility?.reason === EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS
                        ? 'bg-success/10 text-success border border-success/20 cursor-default'
                        : 'bg-muted/10 text-muted border border-border/40 cursor-not-allowed grayscale'
                  }`}
                >
                  {eligibility?.reason === EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS
                    ? EXPLORE_JOBS_UI.DETAIL.SIDEBAR.APPLIED
                    : EXPLORE_JOBS_UI.DETAIL.SIDEBAR.APPLY_NOW}
                </button>
              </div>
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  );
}
