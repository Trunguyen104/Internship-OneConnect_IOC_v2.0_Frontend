'use client';

import React, { createContext, useContext } from 'react';
import { Button, Tag } from 'antd';
import Link from 'next/link';
import { ExternalLink, Building2, User, BookOpen } from 'lucide-react';
import { INTERNSHIP_UI } from '@/constants/internship-management/internship.js';
import { INTERNSHIP_STATUS, INTERNSHIP_STATUS_CONFIG } from '../constants/internshipStatus.js';
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

  if (status === INTERNSHIP_STATUS.CLOSED) return null;

  return (
    <InternshipCardContext.Provider value={data}>
      <div
        className={`bg-surface border-border transition-all hover:shadow-md ${className} overflow-hidden rounded-3xl border p-6 shadow-sm`}
      >
        {children}
      </div>
    </InternshipCardContext.Provider>
  );
};

/**
 * InternshipCard Sub-components
 */
const Header = ({ title, isCurrent = false }) => {
  const { status } = useInternshipCard();
  const config = INTERNSHIP_STATUS_CONFIG[status];

  return (
    <div className='mb-6 flex items-start justify-between'>
      <div className='space-y-1'>
        <div className='flex items-center gap-3'>
          <span className='text-muted text-[10px] font-bold tracking-widest uppercase'>
            {INTERNSHIP_UI.LABELS.CYCLE}
          </span>
          {isCurrent && (
            <Tag
              color='green'
              className='bg-success-surface text-success border-none px-2 py-0.5 font-sans text-[10px] font-bold'
            >
              {INTERNSHIP_UI.LABELS.CURRENT}
            </Tag>
          )}
        </div>
        <h2 className='text-text text-2xl font-bold'>{title}</h2>
      </div>

      <div className='flex flex-col items-end gap-2'>
        <span className='text-muted text-[10px] font-bold tracking-widest uppercase'>
          {INTERNSHIP_UI.LABELS.STATUS}
        </span>
        <Tag
          color={config.tagColor}
          className='m-0 border-none px-4 py-1 text-xs font-bold uppercase transition-all'
        >
          {config.label}
        </Tag>
      </div>
    </div>
  );
};

const Stepper = () => {
  const { status } = useInternshipCard();
  if (status === INTERNSHIP_STATUS.CLOSED) return null;

  return <ProgressStepper currentStatus={status} />;
};

const BodyTitle = ({ title, href = null }) => {
  const { status } = useInternshipCard();
  const config = INTERNSHIP_STATUS_CONFIG[status];

  return (
    <div className='border-border mt-8 mb-6 border-t pt-8'>
      <div className='flex items-center gap-3'>
        {href ? (
          <Link
            href={href}
            className='text-text text-xl font-bold hover:underline'
            title='Go to Space'
          >
            {title}
          </Link>
        ) : (
          <h3 className='text-text text-xl font-bold'>{title}</h3>
        )}
        <Tag
          color='purple'
          className='bg-info-surface text-info border-none px-3 py-0.5 text-[10px] font-bold'
        >
          {config.label}
        </Tag>
      </div>
    </div>
  );
};

const Info = ({ enterprise, mentor, project }) => {
  const { status } = useInternshipCard();

  const isVisible = status === INTERNSHIP_STATUS.ACTIVE || status === INTERNSHIP_STATUS.ENDED;
  if (!isVisible) return null;

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      {/* Mentor Info */}
      <div className='flex items-center gap-4'>
        <div className='bg-success-surface text-success flex h-12 w-12 items-center justify-center rounded-full shadow-sm'>
          <User size={24} />
        </div>
        <div className='flex flex-col'>
          <span className='text-muted text-xs font-medium'>{INTERNSHIP_UI.LABELS.MENTOR}</span>
          <span className='text-text text-lg font-bold'>
            {mentor || INTERNSHIP_UI.LABELS.FALLBACK_VALUE || 'N/A'}
          </span>
        </div>
      </div>

      {/* Enterprise Info */}
      <div className='flex items-center gap-4'>
        <div className='bg-primary-surface text-primary flex h-12 w-12 items-center justify-center rounded-full shadow-sm'>
          <Building2 size={24} />
        </div>
        <div className='flex flex-col'>
          <span className='text-muted text-xs font-medium'>{INTERNSHIP_UI.LABELS.ENTERPRISE}</span>
          <span className='text-text text-lg font-bold'>
            {enterprise || INTERNSHIP_UI.LABELS.FALLBACK_VALUE || 'N/A'}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className='flex items-center gap-4'>
        <div className='bg-info-surface text-info flex h-12 w-12 items-center justify-center rounded-full shadow-sm'>
          <BookOpen size={24} />
        </div>
        <div className='flex flex-col'>
          <span className='text-muted text-xs font-medium'>{INTERNSHIP_UI.LABELS.PROJECT}</span>
          <span className='text-text text-lg font-bold'>
            {project || INTERNSHIP_UI.LABELS.FALLBACK_VALUE || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

const Action = ({ onDetailClick }) => {
  const { status } = useInternshipCard();
  const showBtn = status === INTERNSHIP_STATUS.ACTIVE || status === INTERNSHIP_STATUS.ENDED;

  if (!showBtn) return null;

  return (
    <div className='mt-10 flex justify-end'>
      <Button
        type='primary'
        size='large'
        icon={<ExternalLink size={18} />}
        className='group bg-primary shadow-primary/10 h-14 rounded-2xl px-10 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95'
        onClick={onDetailClick}
      >
        <span className='flex items-center gap-2'>{INTERNSHIP_UI.LABELS.VIEW_DETAIL}</span>
      </Button>
    </div>
  );
};

InternshipCard.Header = Header;
InternshipCard.Stepper = Stepper;
InternshipCard.BodyTitle = BodyTitle;
InternshipCard.Info = Info;
InternshipCard.Action = Action;

export default InternshipCard;
