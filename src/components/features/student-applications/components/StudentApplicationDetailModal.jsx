'use client';

import { App, Modal, Skeleton } from 'antd';
import dayjs from 'dayjs';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  History,
  Info,
  Trash2,
  XCircle,
} from 'lucide-react';
import React from 'react';

import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import {
  APPLICATION_SOURCE,
  APPLICATION_STATUS,
} from '@/constants/applications/application.constants';
import { cn } from '@/lib/cn';

import { STUDENT_APPLICATION_STATUS_UI } from '../constants/studentApplicationStatus';
import { STUDENT_APPLICATIONS_UI } from '../constants/uiText';
import {
  useStudentApplicationActions,
  useStudentApplicationDetail,
} from '../hooks/useStudentApplications';

export const StudentApplicationDetailModal = ({ open, onCancel, applicationId }) => {
  const { modal: modalApi } = App.useApp();
  const { data: app, isLoading } = useStudentApplicationDetail(applicationId);
  const { withdraw, hide, isWithdrawing, isHiding } = useStudentApplicationActions(applicationId);

  const isUniAssign = app?.source === APPLICATION_SOURCE.UNI_ASSIGN || app?.isUniAssign;
  const statusUI = app
    ? {
        ...(STUDENT_APPLICATION_STATUS_UI[app.status] || { variant: 'neutral', label: app.status }),
      }
    : null;

  // Resolve dynamic label for PENDING_ASSIGNMENT in Uni Assign case
  if (app?.status === APPLICATION_STATUS.PENDING_ASSIGNMENT && isUniAssign) {
    statusUI.label = STUDENT_APPLICATIONS_UI.STATUS_LABELS.UNI_ASSIGNED;
  }

  const sortedHistories = app?.statusHistories
    ? [...app.statusHistories].sort(
        (a, b) => new Date(a.changedAt || 0) - new Date(b.changedAt || 0)
      )
    : [];

  const onWithdrawClick = () => {
    modalApi.confirm({
      title: (
        <span className="text-lg font-black tracking-tight text-slate-800">
          {STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW_TITLE}
        </span>
      ),
      content: (
        <p className="mt-2 font-medium text-slate-500">
          {STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW_CONTENT.replace(
            '{enterpriseName}',
            app.enterpriseName
          )}
        </p>
      ),
      okText: STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW,
      okType: 'danger',
      cancelText: STUDENT_APPLICATIONS_UI.MODAL.CANCEL,
      centered: true,
      onOk: () => withdraw(),
      okButtonProps: { loading: isWithdrawing },
    });
  };

  const onHideClick = () => {
    modalApi.confirm({
      title: (
        <span className="text-lg font-black tracking-tight text-slate-800">
          {STUDENT_APPLICATIONS_UI.MODAL.HIDE_TITLE}
        </span>
      ),
      content: (
        <p className="mt-2 font-medium text-slate-500">
          {STUDENT_APPLICATIONS_UI.MODAL.HIDE_CONTENT}
        </p>
      ),
      okText: STUDENT_APPLICATIONS_UI.MODAL.HIDE,
      cancelText: STUDENT_APPLICATIONS_UI.MODAL.CANCEL,
      centered: true,
      onOk: () => hide(),
      okButtonProps: { loading: isHiding },
    });
  };

  // Status-specific banner logic
  const renderStatusBanner = () => {
    if (!app) return null;

    const bannerConfig = STUDENT_APPLICATION_STATUS_UI[app.status]?.banner;
    if (!bannerConfig && app.status !== APPLICATION_STATUS.PENDING_ASSIGNMENT) return null;

    let icon = null;
    let text = null;

    switch (app.status) {
      case APPLICATION_STATUS.INTERVIEWING:
        icon = <Info className="size-5" />;
        text = STUDENT_APPLICATIONS_UI.MESSAGES.INTERVIEWING;
        break;
      case APPLICATION_STATUS.OFFERED:
        icon = <Clock className="size-5" />;
        text = STUDENT_APPLICATIONS_UI.MESSAGES.OFFERED;
        break;
      case APPLICATION_STATUS.PLACED:
        icon = <CheckCircle2 className="size-5" />;
        text = STUDENT_APPLICATIONS_UI.MESSAGES.PLACED.replace(
          '{enterpriseName}',
          app.enterpriseName
        );
        break;
      case APPLICATION_STATUS.REJECTED:
        icon = <XCircle className="size-5" />;
        text = isUniAssign
          ? STUDENT_APPLICATIONS_UI.MESSAGES.REJECTED_UNI
          : STUDENT_APPLICATIONS_UI.MESSAGES.REJECTED_SELF;
        break;
      case APPLICATION_STATUS.PENDING_ASSIGNMENT:
        if (isUniAssign) {
          icon = <AlertCircle className="size-5" />;
          text = STUDENT_APPLICATIONS_UI.MESSAGES.PENDING_ASSIGNMENT_UNI.replace(
            '{enterpriseName}',
            app.enterpriseName
          );
        }
        break;
      default:
        return null;
    }

    if (!text) return null;

    return (
      <div
        className={cn(
          'mb-6 flex gap-3 rounded-2xl border p-4',
          bannerConfig?.className || 'bg-slate-50 border-slate-100 text-slate-700'
        )}
      >
        <div className="shrink-0 pt-0.5">{icon}</div>
        <p className="text-[13px] font-bold leading-relaxed">{text}</p>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={780}
      footer={null}
      centered
      className="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-[32px] [&_.ant-modal-content]:p-0"
    >
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-7 text-white">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                {STUDENT_APPLICATIONS_UI.MODAL.DETAIL_TITLE}
              </span>
              {app?.jobPostingStatus === 'Closed' && (
                <Badge
                  variant="neutral"
                  className="border-white/20 bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/80"
                >
                  {STUDENT_APPLICATIONS_UI.COMMON.CLOSED}
                </Badge>
              )}
              {app?.jobPostingStatus === 'Deleted' && (
                <Badge variant="danger" className="text-[9px] font-black uppercase tracking-widest">
                  {STUDENT_APPLICATIONS_UI.COMMON.DELETED}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="mb-1 line-clamp-2 text-2xl font-black tracking-tight text-white">
                  {isLoading ? (
                    <Skeleton.Input active size="small" />
                  ) : (
                    app?.jobPostingTitle || STUDENT_APPLICATIONS_UI.COMMON.GENERAL_APP
                  )}
                </h2>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg bg-white/10">
                    {app?.enterpriseLogo ? (
                      <img src={app.enterpriseLogo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="size-3.5" />
                    )}
                  </div>
                  <span className="text-sm font-bold">{app?.enterpriseName}</span>
                </div>
              </div>

              <div className="shrink-0">
                <Badge
                  variant={isUniAssign ? 'warning-soft' : 'info-soft'}
                  className={cn(
                    'h-7 px-3 text-[10px] font-black uppercase tracking-widest',
                    isUniAssign && 'border-indigo-500/50 bg-indigo-500/30 text-indigo-100'
                  )}
                >
                  {isUniAssign
                    ? STUDENT_APPLICATIONS_UI.SOURCE.UNI_ASSIGN
                    : STUDENT_APPLICATIONS_UI.SOURCE.SELF_APPLY}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[550px] space-y-6 overflow-y-auto px-8 py-8">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {STUDENT_APPLICATIONS_UI.COMMON.CURRENT_STATUS}
              </span>
              {isLoading ? (
                <Skeleton.Button active size="small" />
              ) : (
                <StatusBadge
                  variant={statusUI?.variant}
                  label={statusUI?.label}
                  showDot={statusUI?.showDot}
                  className={cn('font-bold', statusUI?.className)}
                />
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isUniAssign
                  ? STUDENT_APPLICATIONS_UI.COMMON.ASSIGNED_ON
                  : STUDENT_APPLICATIONS_UI.COMMON.APPLIED_ON}
              </span>
              <span className="text-sm font-black text-slate-700">
                {isLoading
                  ? STUDENT_APPLICATIONS_UI.COMMON.LOADING
                  : dayjs(app?.appliedAt || app?.createdAt).format('DD MMM, YYYY')}
              </span>
            </div>
          </div>

          {renderStatusBanner()}

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Job & Internship Info */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-[11px] font-black uppercase tracking-widest text-slate-900">
                <Calendar className="size-4 text-primary" />{' '}
                {STUDENT_APPLICATIONS_UI.MODAL.DETAIL_TITLE}
              </h3>

              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    {STUDENT_APPLICATIONS_UI.COMMON.INTERN_PHASE}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {isLoading
                        ? STUDENT_APPLICATIONS_UI.COMMON.LOADING
                        : app?.internPhaseName || STUDENT_APPLICATIONS_UI.COMMON.N_A}
                    </span>
                    {(app?.phaseStartDate || app?.phaseEndDate) && (
                      <span className="mt-0.5 text-[11px] font-bold text-slate-400">
                        {dayjs(app.phaseStartDate).format('DD/MM/YYYY')}
                        {STUDENT_APPLICATIONS_UI.COMMON.DATE_ARROW}
                        {dayjs(app.phaseEndDate).format('DD/MM/YYYY')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    {STUDENT_APPLICATIONS_UI.COMMON.DEPARTMENT}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {isLoading
                      ? STUDENT_APPLICATIONS_UI.COMMON.LOADING
                      : app?.departmentName || STUDENT_APPLICATIONS_UI.COMMON.N_A}
                  </span>
                </div>

                {!isUniAssign && app?.cvUrl && (
                  <div className="pt-2">
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      <FileText className="size-3.5" />
                      {STUDENT_APPLICATIONS_UI.COMMON.VIEW_CV}
                      <ExternalLink className="size-3.5 opacity-50 group-hover:opacity-100" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Application Timeline */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-[11px] font-black uppercase tracking-widest text-slate-900">
                <History className="size-4 text-primary" />{' '}
                {STUDENT_APPLICATIONS_UI.COMMON.TIMELINE}
              </h3>

              {isLoading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : (
                <div className="relative space-y-5 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100">
                  {sortedHistories.length > 0 ? (
                    sortedHistories.map((h, i) => (
                      <div key={i} className="relative flex gap-4 pl-7">
                        <div
                          className={cn(
                            'absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm',
                            i === sortedHistories.length - 1 ? 'bg-primary' : 'bg-slate-300'
                          )}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                            {h.statusLabel || h.status || STUDENT_APPLICATIONS_UI.COMMON.UPDATED}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {dayjs(h.changedAt).format('DD MMM, YYYY • HH:mm')}
                          </span>
                          {h.note && (
                            <div className="relative mt-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-[11px] font-medium text-slate-600">
                              <div className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black uppercase text-slate-300">
                                {STUDENT_APPLICATIONS_UI.MESSAGES.REJECT_REASON_TITLE}
                              </div>
                              &quot;{h.note}&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 pl-7 text-xs font-bold italic text-slate-400">
                      {STUDENT_APPLICATIONS_UI.COMMON.NO_HISTORY}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {!isUniAssign && app?.status === APPLICATION_STATUS.APPLIED && (
              <Button
                variant="outline"
                onClick={onWithdrawClick}
                disabled={isWithdrawing}
                className="h-10 rounded-xl border-rose-200 bg-white px-5 text-[11px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 className="mr-2 size-3.5" />
                {STUDENT_APPLICATIONS_UI.ACTIONS.WITHDRAW}
              </Button>
            )}
            {(app?.status === APPLICATION_STATUS.REJECTED ||
              app?.status === APPLICATION_STATUS.WITHDRAWN) && (
              <Button
                variant="outline"
                onClick={onHideClick}
                disabled={isHiding}
                className="h-10 rounded-xl border-slate-200 bg-white px-5 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-700"
              >
                <XCircle className="mr-2 size-3.5" />
                {STUDENT_APPLICATIONS_UI.ACTIONS.HIDE}
              </Button>
            )}
          </div>

          <Button
            onClick={onCancel}
            className="h-10 rounded-xl bg-slate-900 px-7 text-[11px] font-black uppercase tracking-widest text-white shadow-md hover:bg-slate-800"
          >
            {STUDENT_APPLICATIONS_UI.MODAL.CLOSE}
            <ChevronRight className="ml-1 size-3.5" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentApplicationDetailModal;
