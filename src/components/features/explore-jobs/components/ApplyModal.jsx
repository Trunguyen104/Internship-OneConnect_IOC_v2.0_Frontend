'use client';

import { FileText, Send, Share2, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Modal } from '@/components/ui/modal';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';

export default function ApplyModal({ open, onCancel, onConfirm, job, cvUrl, isApplying }) {
  if (!job) return null;

  // Extract filename from URL or use default
  const cvFilename = cvUrl ? cvUrl.split('/').pop().split('?')[0] : 'MyCV.pdf';

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      closeIcon={null}
      className="p-0 overflow-hidden rounded-[2rem]"
    >
      <div className="relative">
        {/* Header Decor */}
        <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative flex items-center justify-center">
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-primary/10 relative z-10">
            <Send className="h-10 w-10 text-primary" />
          </div>
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
          >
            <X className="h-4 w-4 text-text" />
          </button>
        </div>

        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-[11px] font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{EXPLORE_JOBS_UI.APPLY_MODAL.READY_LABEL}</span>
          </div>

          <h2 className="text-2xl font-extrabold text-text mb-2">
            {EXPLORE_JOBS_UI.APPLY_MODAL.TITLE}
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            {EXPLORE_JOBS_UI.APPLY_MODAL.CONTENT(job.title, job.enterprise?.fullName)}
          </p>

          {/* CV Info Box */}
          <div className="bg-bg border border-border/40 rounded-2xl p-5 mb-10 text-left relative group overflow-hidden">
            <div className="flex items-center gap-4 relative z-10 transition-transform group-hover:translate-x-1">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                  {EXPLORE_JOBS_UI.APPLY_MODAL.CV_SNAPSHOT}
                </p>
                <p className="text-sm font-bold text-text truncate">{cvFilename}</p>
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

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isApplying}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-extrabold shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:grayscale disabled:cursor-not-allowed"
            >
              {isApplying
                ? EXPLORE_JOBS_UI.APPLY_MODAL.SUBMITTING_BUTTON
                : EXPLORE_JOBS_UI.APPLY_MODAL.SUBMIT_BUTTON}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3 text-muted font-bold text-sm hover:text-text transition-colors"
            >
              {EXPLORE_JOBS_UI.APPLY_MODAL.CANCEL_BUTTON}
            </button>
          </div>

          <p className="mt-8 text-[11px] text-muted leading-relaxed italic">
            {EXPLORE_JOBS_UI.APPLY_MODAL.FOOTER_NOTE}
          </p>
        </div>
      </div>
    </Modal>
  );
}
