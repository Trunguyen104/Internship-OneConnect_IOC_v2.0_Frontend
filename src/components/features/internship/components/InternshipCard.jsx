'use client';

import React, { createContext, useContext } from 'react';
import { Button, Tag } from 'antd';
import { ExternalLink, Building2, User, BookOpen, Check } from 'lucide-react';
import { INTERNSHIP_STATUS, INTERNSHIP_STATUS_CONFIG } from '../../../studentlist/constants/internshipStatus.js';
import ProgressStepper from './ProgressStepper';

const InternshipCardContext = createContext(null);

const useInternshipCard = () => {
  const context = useContext(InternshipCardContext);
  if (!context) {
    throw new Error('InternshipCard sub-components must be rendered within InternshipCard');
  }
  return context;
};

const TEXT = {
  INTERNSHIP_CYCLE: 'Internship Cycle',
  CURRENT: 'CURRENT',
  STATUS: 'Status',
  MENTOR: 'Mentor',
  ENTERPRISE: 'Doanh nghiệp',
  PROJECT: 'Dự án',
  VIEW_DETAIL: 'View Detailed Training Plan',
};

/**
 * InternshipCard Root Component
 */
const InternshipCard = ({ data, children, className = '' }) => {
  const { status } = data;

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
          <span className="text-[10px] font-bold tracking-widest text-muted uppercase">
            {TEXT.INTERNSHIP_CYCLE}
          </span>
          {isCurrent && (
            <Tag color="green" className="border-none bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success font-sans">
              {TEXT.CURRENT}
            </Tag>
          )}
        </div>
        <h2 className="text-2xl font-bold text-text">{title}</h2>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] font-bold tracking-widest text-muted uppercase">
          {TEXT.STATUS}
        </span>
        <Tag 
          color={config.tagColor} 
          className="m-0 border-none px-4 py-1 text-xs font-bold uppercase transition-all"
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
  if (status === INTERNSHIP_STATUS.CLOSED) return null;

  return <ProgressStepper currentStatus={status} />;
};

/**
 * InternshipCard.BodyTitle
 */
InternshipCard.BodyTitle = ({ title }) => {
  const { status } = useInternshipCard();
  const config = INTERNSHIP_STATUS_CONFIG[status];

  return (
    <div className="mt-8 mb-6 border-t border-border pt-8">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-text">{title}</h3>
        <Tag color="purple" className="border-none bg-blue-50 px-3 py-0.5 text-[10px] font-bold text-info">
           {config.label}
        </Tag>
      </div>
    </div>
  );
};

/**
 * InternshipCard.Info
 */
InternshipCard.Info = ({ enterprise, mentor, project }) => {
  const { status } = useInternshipCard();

  const isVisible = status === INTERNSHIP_STATUS.ACTIVE || status === INTERNSHIP_STATUS.ENDED;
  if (!isVisible) return null;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Mentor Info */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success shadow-sm">
          <User size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted">{TEXT.MENTOR}</span>
          <span className="text-lg font-bold text-text">{mentor || 'N/A'}</span>
        </div>
      </div>

      {/* Enterprise Info */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
          <Building2 size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted">{TEXT.ENTERPRISE}</span>
          <span className="text-lg font-bold text-text">{enterprise || 'N/A'}</span>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-info shadow-sm">
          <BookOpen size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted">{TEXT.PROJECT}</span>
          <span className="text-lg font-bold text-text">{project || 'N/A'}</span>
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
  const showBtn = status === INTERNSHIP_STATUS.ACTIVE || status === INTERNSHIP_STATUS.ENDED;

  if (!showBtn) return null;

  return (
    <div className="mt-10 flex justify-end">
      <Button 
        type="primary" 
        size="large"
        icon={<ExternalLink size={18} />}
        className="group h-14! rounded-2xl bg-[#C55F33]! px-10 font-bold text-white shadow-xl shadow-orange-900/10 transition-all hover:scale-105 active:scale-95"
        onClick={onDetailClick}
      >
        <span className="flex items-center gap-2">
          {TEXT.VIEW_DETAIL}
        </span>
      </Button>
    </div>
  );
};

export default InternshipCard;
