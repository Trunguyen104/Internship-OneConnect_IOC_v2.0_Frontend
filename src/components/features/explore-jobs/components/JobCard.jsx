import { Calendar, MapPin } from 'lucide-react';
import React from 'react';

import { Card } from '@/components/ui/atoms';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';

export default function JobCard({ job, onClick }) {
  const { title, enterprise, location, deadline, salary, type } = job;
  const [logoError, setLogoError] = React.useState(false);

  return (
    <div onClick={() => onClick?.(job.jobId)} className="h-full">
      <Card className="h-full group cursor-pointer hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-white relative overflow-hidden">
        {/* Status Tag - AC-01 Requirement */}
        <div className="absolute top-0 right-0">
          <div
            className={`${job.status === 2 ? 'bg-danger' : 'bg-success'} text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm`}
          >
            {job.statusLabel}
          </div>
        </div>

        <div className="p-4 flex flex-col h-full">
          <div className="flex items-start gap-3">
            {/* Company Logo - Compact & Fail-safe */}
            <div className="h-11 w-11 rounded-xl bg-bg border border-border/40 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              {enterprise?.logoUrl && !logoError ? (
                <img
                  src={enterprise.logoUrl}
                  alt={enterprise.fullName}
                  className="h-full w-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="text-primary font-bold text-lg">{enterprise?.fullName?.[0]}</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors leading-snug pr-8">
                {title}
              </h3>
              <p className="text-muted text-[11px] font-bold truncate mt-0.5 opacity-70">
                {enterprise?.fullName}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="bg-primary/5 text-primary text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              {type || 'Full-time'}
            </span>
            <span className="bg-success/5 text-success text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              {salary || EXPLORE_JOBS_UI.CARD.SALARY_FALLBACK}
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted text-[9px] font-bold uppercase tracking-wider">
              <MapPin className="h-3 w-3" />
              <span>{location || EXPLORE_JOBS_UI.CARD.LOCATION_FALLBACK}</span>
            </div>
            <div className="flex items-center gap-1.5 text-danger font-bold text-[9px] uppercase tracking-wider">
              <Calendar className="h-3 w-3" />
              <span>
                {EXPLORE_JOBS_UI.CARD.DEADLINE_LABEL}:{' '}
                {deadline || EXPLORE_JOBS_UI.CARD.NOT_AVAILABLE}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
