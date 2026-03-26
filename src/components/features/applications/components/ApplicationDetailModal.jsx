'use client';

import { Divider, Modal, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { Calendar, ExternalLink, FileText, Mail, School, User } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { APPLICATION_SOURCE } from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import { useApplicationDetail } from '../hooks/useApplications';
import ApplicationStatusBadge from './ApplicationStatusBadge';

/**
 * Detailed view for an application.
 * Redesigned to be clean, professional, and matching Enterprise Portal standards.
 */
export const ApplicationDetailModal = ({ open, onCancel, applicationId }) => {
  const { data: app, isLoading } = useApplicationDetail(applicationId);

  // Close helper
  const handleClose = () => {
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={720}
      footer={null}
      centered
      className="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-[32px] [&_.ant-modal-content]:p-0 [&_.ant-modal-close]:right-6 [&_.ant-modal-close]:top-6"
    >
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="relative bg-slate-900 px-10 py-10 text-white">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">
              {APPLICATIONS_UI.MODAL.CANDIDATE_PROFILE}
            </span>
            <h2 className="mb-0 text-3xl font-black tracking-tight text-white">
              {isLoading ? <Skeleton.Input active size="large" /> : app?.studentFullName}
            </h2>
          </div>
        </div>

        <div className="space-y-8 px-10 py-8">
          {/* Metadata Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5 border-l-2 border-primary pl-4">
              <span className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                {APPLICATIONS_UI.COLUMNS.STATUS}
              </span>
              <div className="mt-1">
                {isLoading ? (
                  <Skeleton.Button active size="small" />
                ) : (
                  <ApplicationStatusBadge status={app?.status} />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 border-l-2 border-slate-200 pl-4">
              <span className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                Source
              </span>
              <span className="text-sm font-bold text-slate-700">
                {isLoading
                  ? '...'
                  : app?.source === APPLICATION_SOURCE.UNI_ASSIGN
                    ? 'Uni-Assign'
                    : 'Self-Apply'}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 border-l-2 border-slate-200 pl-4">
              <span className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                {APPLICATIONS_UI.COLUMNS.APPLIED_DATE}
              </span>
              <span className="text-sm font-bold text-slate-700">
                {isLoading ? '...' : dayjs(app?.appliedAt).format('DD MMM, YYYY')}
              </span>
            </div>
          </div>

          <Divider className="my-0 border-slate-100" />

          {/* Main Info Columns */}
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {/* Left: Student Basic Info */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900">
                <User className="h-3.5 w-3.5 text-primary" /> {APPLICATIONS_UI.MODAL.BASIC_INFO}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 shadow-sm">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {APPLICATIONS_UI.MODAL.STUDENT_ID}
                    </span>
                    <span className="text-sm font-bold text-slate-600">
                      {isLoading ? '...' : app?.studentCode || '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 shadow-sm">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {APPLICATIONS_UI.MODAL.EMAIL}
                    </span>
                    <span className="max-w-[200px] truncate text-sm font-bold text-slate-600">
                      {isLoading ? '...' : app?.studentEmail || '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 shadow-sm">
                    <School className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {APPLICATIONS_UI.MODAL.UNIVERSITY}
                    </span>
                    <span className="line-clamp-1 text-sm font-bold text-slate-600">
                      {isLoading ? '...' : app?.schoolName || app?.universityName || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Job Application Details */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900">
                <Calendar className="h-3.5 w-3.5 text-primary" />{' '}
                {APPLICATIONS_UI.MODAL.APPLYING_FOR}
              </h3>
              <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-primary">
                    {APPLICATIONS_UI.MODAL.JOB_POSITION}
                  </span>
                  <span className="text-sm font-black leading-tight text-slate-800">
                    {isLoading ? '...' : app?.jobPostingTitle || APPLICATIONS_UI.MODAL.GENERAL_APP}
                  </span>
                  <span className="mt-2 text-[11px] font-medium text-slate-500">
                    {APPLICATIONS_UI.MODAL.DEPARTMENT}{' '}
                    {app?.departmentName || APPLICATIONS_UI.MODAL.UNSPECIFIED}
                  </span>
                </div>
              </div>

              {/* CV Section Integrated */}
              {app?.cvUrl && (
                <div className="pt-2">
                  <a
                    href={app.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 transition-all hover:border-primary/40 hover:bg-primary/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md transition-transform group-hover:scale-105">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-[13px] font-black uppercase tracking-wider text-primary">
                        {APPLICATIONS_UI.MODAL.VIEW_CV}
                      </span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-primary opacity-50 transition-opacity group-hover:opacity-100" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleClose}
              className="h-12 rounded-2xl bg-slate-900 px-10 font-black uppercase tracking-widest text-white shadow-lg hover:bg-slate-800"
            >
              {APPLICATIONS_UI.MODAL.CLOSE}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationDetailModal;
