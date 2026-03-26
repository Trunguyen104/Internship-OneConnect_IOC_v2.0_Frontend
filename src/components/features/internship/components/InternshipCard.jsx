'use client';

import { Button, Tag } from 'antd';
import { BookOpen, Building2, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';
import React, { createContext, useContext } from 'react';

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
  return (
    <InternshipCardContext.Provider value={data}>
      <div
        className={`bg-surface border-gray-100 transition-all duration-300 hover:shadow-xl ${className} overflow-hidden rounded-[32px] border p-8 shadow-sm`}
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
  const { status, isPlaced } = useInternshipCard();
  const config =
    INTERNSHIP_STATUS_CONFIG[status] || INTERNSHIP_STATUS_CONFIG[INTERNSHIP_STATUS.ACTIVE];

  return (
    <div className="mb-6 flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-muted text-[10px] font-bold tracking-widest uppercase">
            {INTERNSHIP_UI.LABELS.CYCLE}
          </span>
          {isCurrent && (
            <Tag
              color="green"
              className="bg-success-surface text-success border-none px-3 py-1 font-sans text-[10px] font-bold"
            >
              {INTERNSHIP_UI.LABELS.CURRENT}
            </Tag>
          )}
          {!isPlaced &&
            (status === INTERNSHIP_STATUS.UPCOMING || status === INTERNSHIP_STATUS.ACTIVE) && (
              <Tag
                color="error"
                className="bg-danger-surface text-danger border-none px-3 py-1 font-sans text-[10px] font-bold"
              >
                {INTERNSHIP_UI.LABELS.UNPLACED_WARNING}
              </Tag>
            )}
        </div>
        <h2 className="text-text text-3xl font-black tracking-tight">{title}</h2>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-muted text-[10px] font-bold tracking-widest uppercase">
          {INTERNSHIP_UI.LABELS.STATUS}
        </span>
        <Tag
          color={config.tagColor}
          className="m-0 border-none px-5 py-1.5 text-xs font-bold uppercase transition-all"
        >
          {config.label}
        </Tag>
      </div>
    </div>
  );
};

const Stepper = () => {
  const { status, journeyStep } = useInternshipCard();
  // Using journeyStep directly if available, else fallback to status-based
  return <ProgressStepper currentStatus={status} journeyStep={journeyStep} />;
};

const BodyTitle = ({ title, href = null }) => {
  const { status, isPlaced } = useInternshipCard();
  const config =
    INTERNSHIP_STATUS_CONFIG[status] || INTERNSHIP_STATUS_CONFIG[INTERNSHIP_STATUS.ACTIVE];

  return (
    <div className="border-border mt-8 mb-6 border-t pt-8">
      <div className="flex items-center gap-3">
        {isPlaced && href ? (
          <Link
            href={href}
            className="text-2xl font-black tracking-tight text-gray-900 no-underline transition-all hover:text-primary hover:underline"
            title="Go to Space"
          >
            {title}
          </Link>
        ) : (
          <h3 className="text-text text-2xl font-black tracking-tight">
            {title ||
              (isPlaced ? INTERNSHIP_UI.LABELS.PLACED_SUCCESS : INTERNSHIP_UI.LABELS.NO_GROUP)}
          </h3>
        )}
        {isPlaced && (
          <Tag
            color="purple"
            className="bg-info-surface text-info border-none px-4 py-1 text-[10px] font-bold uppercase"
          >
            {config.label}
          </Tag>
        )}
      </div>
    </div>
  );
};

const Info = ({ enterprise, mentor, project }) => {
  const { isPlaced } = useInternshipCard();

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
      {/* Mentor Info */}
      <div className="flex items-center gap-5">
        <div className="bg-success-surface text-success flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform hover:scale-105">
          <User size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-muted text-xs font-bold uppercase tracking-wider">
            {INTERNSHIP_UI.LABELS.MENTOR}
          </span>
          <span className="text-text text-xl font-black">
            {mentor ||
              (isPlaced ? INTERNSHIP_UI.LABELS.UPDATE_PENDING : INTERNSHIP_UI.LABELS.NOT_AVAILABLE)}
          </span>
        </div>
      </div>

      {/* Enterprise Info */}
      <div className="flex items-center gap-5">
        <div className="bg-primary-surface text-primary flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform hover:scale-105">
          <Building2 size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-muted text-xs font-bold uppercase tracking-wider">
            {INTERNSHIP_UI.LABELS.ENTERPRISE}
          </span>
          <span className="text-text text-xl font-black">
            {enterprise ||
              (isPlaced ? INTERNSHIP_UI.LABELS.UPDATE_PENDING : INTERNSHIP_UI.LABELS.NOT_AVAILABLE)}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex items-center gap-5">
        <div className="bg-info-surface text-info flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform hover:scale-105">
          <BookOpen size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-muted text-xs font-bold uppercase tracking-wider">
            {INTERNSHIP_UI.LABELS.PROJECT}
          </span>
          <span className="text-text text-xl font-black">
            {project ||
              (isPlaced ? INTERNSHIP_UI.LABELS.UPDATE_PENDING : INTERNSHIP_UI.LABELS.NOT_AVAILABLE)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Action = ({ onDetailClick }) => {
  const { status, isPlaced } = useInternshipCard();

  if (!isPlaced) {
    if (status === INTERNSHIP_STATUS.UPCOMING) {
      return (
        <div className="mt-12 flex flex-col items-end gap-4">
          <p className="text-muted font-medium italic">{INTERNSHIP_UI.MESSAGES.APPLY_PROMPT}</p>
          <Button
            type="primary"
            size="large"
            href="/job-board"
            className="bg-primary h-14 rounded-2xl px-10 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            {INTERNSHIP_UI.MESSAGES.VIEW_JOB_POSTINGS}
          </Button>
        </div>
      );
    }
    if (status === INTERNSHIP_STATUS.ACTIVE) {
      return (
        <div className="bg-danger-surface border-danger/20 mt-12 rounded-[24px] border p-6 text-center">
          <p className="text-danger text-lg font-bold">
            {INTERNSHIP_UI.MESSAGES.UNPLACED_ACTIVE_ALERT}
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="mt-12 flex justify-end">
      <Button
        type="primary"
        size="large"
        icon={<ExternalLink size={20} />}
        className="group bg-primary shadow-primary/20 h-16 rounded-[24px] px-12 font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
        onClick={onDetailClick}
      >
        <span className="flex items-center gap-3 text-lg font-black uppercase tracking-tight">
          {INTERNSHIP_UI.LABELS.VIEW_DETAIL}
        </span>
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
