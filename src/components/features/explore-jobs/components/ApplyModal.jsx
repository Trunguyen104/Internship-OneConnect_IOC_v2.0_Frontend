'use client';

import { FileText, Send, Share2, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Modal } from '@/components/ui/modal';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';

export default function ApplyModal({ open, onCancel, onConfirm, job, cvUrl, isApplying }) {
  if (!job) return null;

  const hasCV = !!cvUrl;
  // Extract filename from URL or use default
  const cvFilename = cvUrl
    ? cvUrl.split('/').pop().split('?')[0]
    : EXPLORE_JOBS_UI.APPLY_MODAL.DEFAULT_CV_FILENAME;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={420}
      centered
      closeIcon={null}
      className="p-0 overflow-hidden rounded-[1.5rem]"
    >
      <div className="relative">
        {/* Header Decor */}
        <div
          className={`h-24 bg-gradient-to-br transition-colors ${
            hasCV ? 'from-primary/20 to-primary/5' : 'from-warning/20 to-warning/5'
          } relative flex items-center justify-center`}
        >
          <div className="bg-white p-3 rounded-2xl shadow-xl shadow-primary/10 relative z-10 transition-transform hover:scale-110">
            {hasCV ? (
              <Send className="h-8 w-8 text-primary" />
            ) : (
              <FileText className="h-8 w-8 text-warning" />
            )}
          </div>
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
          >
            <X className="h-4 w-4 text-text" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-black px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>{EXPLORE_JOBS_UI.APPLY_MODAL.READY_LABEL}</span>
          </div>

          <h2 className="text-xl font-bold text-text mb-1.5">
            {hasCV ? EXPLORE_JOBS_UI.APPLY_MODAL.TITLE : EXPLORE_JOBS_UI.ELIGIBILITY.NO_CV_TITLE}
          </h2>
          <p className="text-muted text-[13px] leading-relaxed mb-6">
            {hasCV
              ? EXPLORE_JOBS_UI.APPLY_MODAL.CONTENT(job.title, job.enterprise?.fullName)
              : EXPLORE_JOBS_UI.ELIGIBILITY.NO_CV}
          </p>

          {/* CV Info Box (only if hasCV) */}
          {hasCV ? (
            <div className="bg-bg border border-border/40 rounded-xl p-4 mb-8 text-left relative group overflow-hidden">
              <div className="flex items-center gap-3 relative z-10 transition-transform group-hover:translate-x-1">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5">
                    {EXPLORE_JOBS_UI.APPLY_MODAL.CV_SNAPSHOT}
                  </p>
                  <p className="text-[13px] font-bold text-text truncate">{cvFilename}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between relative z-10">
                <Link
                  href="/student/profile"
                  className="text-primary text-xs font-bold hover:underline underline-offset-4"
                >
                  {EXPLORE_JOBS_UI.APPLY_MODAL.UPDATE_CV_LINK}
                </Link>
                <div className="flex gap-2 opacity-30">
                  <Share2 className="h-4 w-4" />
                </div>
              </div>

              {/* Background decor */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
            </div>
          ) : (
            <div className="py-4 px-4 bg-warning/5 border border-dashed border-warning/30 rounded-xl mb-8 flex items-center gap-3 text-left">
              <div className="bg-warning/10 p-2 rounded-lg shrink-0">
                <Sparkles className="h-4 w-4 text-warning" />
              </div>
              <p className="text-[12px] text-warning-deep font-semibold">
                {EXPLORE_JOBS_UI.APPLY_MODAL.NO_CV_WARNING}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {hasCV ? (
              <button
                onClick={onConfirm}
                disabled={isApplying}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:grayscale disabled:cursor-not-allowed"
              >
                {isApplying
                  ? EXPLORE_JOBS_UI.APPLY_MODAL.SUBMITTING_BUTTON
                  : EXPLORE_JOBS_UI.APPLY_MODAL.SUBMIT_BUTTON}
              </button>
            ) : (
              <Link
                href="/student/profile"
                className="w-full py-3 bg-warning hover:bg-warning-hover text-white rounded-xl font-bold shadow-lg shadow-warning/20 transition-all active:scale-[0.98] flex items-center justify-center text-[13px]"
              >
                {EXPLORE_JOBS_UI.APPLY_MODAL.UPDATE_CV_NOW}
              </Link>
            )}
            <button
              onClick={onCancel}
              className="w-full py-2.5 text-muted font-bold text-[13px] hover:text-text transition-colors"
            >
              {EXPLORE_JOBS_UI.APPLY_MODAL.CANCEL_BUTTON}
            </button>
          </div>

          <p className="mt-6 text-[11px] text-muted leading-relaxed italic">
            {EXPLORE_JOBS_UI.APPLY_MODAL.FOOTER_NOTE}
          </p>
        </div>
      </div>
    </Modal>
  );
}
