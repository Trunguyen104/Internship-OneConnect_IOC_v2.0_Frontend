"use client";

import { Check, FileText, GraduationCap, MapPin, Search } from "lucide-react";
import React from "react";

import { getStepStatus, INTERNSHIP_STEPS } from "../constants/internshipStatus.js";

const STEP_ICONS = {
  registration: GraduationCap,
  interviewing: Search,
  offered: FileText,
  placed: MapPin,
  finalizing: Check,
};

const ProgressStepper = ({ currentStatus, journeyStep }) => {
  return (
    <div className="w-full py-8">
      <div className="relative flex items-start justify-between">
        {INTERNSHIP_STEPS.map((step, index) => {
          // Use journeyStep (1-indexed) if provided, otherwise fallback to old logic
          let status = "upcoming";
          if (journeyStep) {
            if (index + 1 < journeyStep) status = "completed";
            else if (index + 1 === journeyStep) status = "current";
          } else {
            status = getStepStatus(index, currentStatus);
          }
          const Icon = STEP_ICONS[step.key] || Check;
          const isCompleted = status === "completed";
          const isCurrent = status === "current";

          return (
            <React.Fragment key={step.key}>
              {/* Step Node */}
              <div className="relative z-10 flex flex-1 flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "border-success bg-success text-white shadow-lg"
                      : isCurrent
                        ? "border-primary ring-primary/10 bg-surface text-primary font-bold shadow-lg ring-4"
                        : "border-border bg-surface text-muted"
                  }`}
                >
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                </div>

                {/* Step Label */}
                <span
                  className={`mt-3 text-[10px] font-semibold tracking-tight whitespace-nowrap uppercase transition-all duration-300 sm:text-xs ${
                    isCompleted || isCurrent ? "text-text" : "text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Progress Line (Connecting to next) */}
              {index < INTERNSHIP_STEPS.length - 1 && (
                <div className="bg-border relative mt-6 h-0.5 min-w-[20px] flex-1 self-start overflow-hidden">
                  <div
                    className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                      isCompleted ? "bg-success translate-x-0" : "-translate-x-full"
                    }`}
                  />
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
