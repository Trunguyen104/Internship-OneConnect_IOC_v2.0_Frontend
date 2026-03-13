'use client';

import React, { createContext, useContext } from 'react';
import { Badge, Button, Tag } from 'antd';
import { ExternalLink, Building2, User, BookOpen, CheckCircle2 } from 'lucide-react';
import { INTERNSHIP_STATUS, INTERNSHIP_STATUS_CONFIG } from '../constants/internshipStatus';
import ProgressStepper from './ProgressStepper';

const InternshipCardContext = createContext(null);

const useInternshipCard = () => {
  const context = useContext(InternshipCardContext);
  if (!context) {
    throw new Error('InternshipCard sub-components must be rendered within InternshipCard');
  }
  return context;
};

/**
 * InternshipCard Root Component
 */
const InternshipCard = ({ data, children, className = '' }) => {
  const { status } = data;

  // Requirement says to hide if status is 3 (Closed) or as per user rules.
  // Actually, for TermDisplayStatus, 3 is CLOSED.
  if (status === INTERNSHIP_STATUS.CLOSED) return null;

  return (
    <InternshipCardContext.Provider value={data}>
      <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md ${className}`}>
        {children}
      </div>
    </InternshipCardContext.Provider>
  );
};

/**
 * InternshipCard.Header
 */
InternshipCard.Header = ({ title, isCurrent = false }) => {
  const { status } = useInternshipCard();
  const config = INTERNSHIP_STATUS_CONFIG[status];

  return (
    <div className="mb-6 flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Internship Cycle
          </span>
          {isCurrent && (
            <Tag color="green" className="border-none bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              CURRENT
            </Tag>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Status
        </span>
        <Tag 
          color={config.tagColor} 
          className="m-0 border-none px-4 py-1 text-xs font-bold uppercase"
        >
          {config.label}
        </Tag>
      </div>
    </div>
  );
};

/**
 * InternshipCard.Stepper
 */
InternshipCard.Stepper = () => {
  const { status } = useInternshipCard();
  
  // Progress Stepper only shows when status is 0, 1, or 2 (Upcoming, Active, Ended)
  if (status === INTERNSHIP_STATUS.CLOSED) return null;

  return <ProgressStepper currentStatus={status} />;
};

/**
 * InternshipCard.Info
 */
InternshipCard.Info = ({ enterprise, mentor, project }) => {
  const { status } = useInternshipCard();

  // Only show Info Row when status is 1 (Active) or 2 (Ended)
  const isVisible = status === INTERNSHIP_STATUS.ACTIVE || status === INTERNSHIP_STATUS.ENDED;
  
  if (!isVisible) return null;

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 md:grid-cols-3">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <Building2 size={24} className="text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Enterprise</span>
          <span className="font-bold text-slate-900">{enterprise || 'N/A'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <User size={24} className="text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Mentor</span>
          <span className="font-bold text-slate-900">{mentor || 'N/A'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <BookOpen size={24} className="text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Project</span>
          <span className="font-bold text-slate-900">{project || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * InternshipCard.Action
 */
InternshipCard.Action = ({ onDetailClick }) => {
  const { status } = useInternshipCard();

  // Show buttons when status is Active or Ended
  const showBtn = status === INTERNSHIP_STATUS.ACTIVE || status === INTERNSHIP_STATUS.ENDED;

  if (!showBtn) return null;

  return (
    <div className="mt-8 flex justify-end">
      <Button 
        type="primary" 
        size="large"
        icon={<ExternalLink size={18} />}
        className="group h-12! rounded-2xl bg-primary! px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:translate-x-1"
        onClick={onDetailClick}
      >
        View Detailed Training Plan
      </Button>
    </div>
  );
};

export default InternshipCard;
