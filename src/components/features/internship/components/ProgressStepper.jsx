'use client';

import React from 'react';
import { Check, User, Search, FileText, MapPin, GraduationCap } from 'lucide-react';
import { INTERNSHIP_STEPS, getStepStatus } from '../constants/internshipStatus';

const STEP_ICONS = {
  registration: GraduationCap,
  interviewing: Search,
  offered: FileText,
  placed: MapPin,
  finalizing: Check,
};

const ProgressStepper = ({ currentStatus }) => {
  return (
    <div className="w-full py-8">
      <div className="relative flex items-start justify-between">
        {INTERNSHIP_STEPS.map((step, index) => {
          const status = getStepStatus(index, currentStatus);
          const Icon = STEP_ICONS[step.key] || Check;
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';
          
          return (
            <React.Fragment key={step.key}>
              {/* Step Node */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : isCurrent
                      ? 'border-primary bg-white text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10 font-bold'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                
                {/* Step Label */}
                <span
                  className={`mt-3 text-[10px] sm:text-xs font-semibold tracking-tight transition-all duration-300 uppercase whitespace-nowrap ${
                    isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Progress Line (Connecting to next) */}
              {index < INTERNSHIP_STEPS.length - 1 && (
                <div className="mt-6 h-0.5 flex-1 self-start min-w-[20px] bg-slate-200 relative overflow-hidden">
                  <div 
                    className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                      isCompleted ? 'bg-emerald-500 translate-x-0' : '-translate-x-full'
                    }`}
                  />
                  {/* Partial line for current step if needed, but here we just color full segments if completed */}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
