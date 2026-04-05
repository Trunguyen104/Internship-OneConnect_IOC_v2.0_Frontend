'use client';

import { App, Drawer, Skeleton } from 'antd';
import dayjs from 'dayjs';
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Info,
  LogOut,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import React from 'react';

import Badge from '@/components/ui/badge';
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

  const sortedHistories = app?.statusHistories
    ? [...app.statusHistories].sort(
        (a, b) => new Date(b.changedAt || 0) - new Date(a.changedAt || 0)
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

  const renderStatusBanner = () => {
    if (!app) return null;
    let icon = <Info className="size-5" />;
    let text = null;

    switch (app.status) {
      case APPLICATION_STATUS.INTERVIEWING:
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
        text = STUDENT_APPLICATIONS_UI.MESSAGES.PENDING_DEFAULT;
    }

    return (
      <div className="flex gap-4 rounded-[20px] bg-blue-50/50 p-5 ring-1 ring-blue-100/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {icon}
        </div>
        <p className="text-[14px] font-bold leading-relaxed text-blue-700/80">{text}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Drawer
        open={open}
        onClose={onCancel}
        footer={null}
        closable={false}
        styles={{
          body: { padding: 0 },
          wrapper: { width: 640 },
        }}
      >
        <div className="p-8">
          <Skeleton active avatar paragraph={{ rows: 10 }} />
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={onCancel}
      footer={null}
      closable={false}
      styles={{
        body: { padding: 0 },
        wrapper: { width: 640 },
      }}
    >
      <div className="flex flex-col">
        {/* Top Control Bar */}
        <div className="flex justify-end p-4">
          <button
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Header Section */}
        <div className="relative bg-slate-50/50 p-8 pb-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm ring-1 ring-slate-100"
              >
                {isUniAssign
                  ? STUDENT_APPLICATIONS_UI.SOURCE.UNI_ASSIGN
                  : STUDENT_APPLICATIONS_UI.SOURCE.SELF_APPLY}
              </Badge>
              <StatusBadge
                variant={statusUI?.variant}
                label={statusUI?.label}
                showDot={statusUI?.showDot}
                className={cn(
                  'h-6 px-4 text-[10px] font-black tracking-widest uppercase shadow-sm',
                  statusUI?.className
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden p-3 transition-transform hover:scale-105">
              {app?.enterpriseLogoUrl || app?.enterpriseLogo ? (
                <img
                  src={app.enterpriseLogoUrl || app.enterpriseLogo}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-3xl font-black text-slate-300">
                  {app?.enterpriseName?.charAt(0) || 'E'}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
                {app?.jobTitle ||
                  app?.jobPostingTitle ||
                  STUDENT_APPLICATIONS_UI.COMMON.GENERAL_APP}
              </h2>
              <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                <Building2 className="size-5" />
                <span>{app?.enterpriseName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="space-y-8 p-8">
          {renderStatusBanner()}

          <div className="space-y-4">
            {/* Internship Phase Card */}
            <div className="flex flex-col gap-3 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Calendar className="size-3" />
                {STUDENT_APPLICATIONS_UI.STATS.PARTICIPATING_PHASE}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Briefcase className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-slate-700">
                    {app?.internPhaseName ||
                      app?.phaseName ||
                      app?.internshipPhaseName ||
                      STUDENT_APPLICATIONS_UI.COMMON.N_A}
                  </span>
                  {(app?.internPhaseStartDate ||
                    app?.phaseStartDate ||
                    app?.internPhaseEndDate ||
                    app?.phaseEndDate) && (
                    <span className="text-xs font-bold text-slate-400">
                      {dayjs(app.internPhaseStartDate || app.phaseStartDate).format('DD/MM/YYYY')}
                      {' - '}
                      {dayjs(app.internPhaseEndDate || app.phaseEndDate).format('DD/MM/YYYY')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox
                icon={<Calendar className="size-3" />}
                label={STUDENT_APPLICATIONS_UI.STATS.APPLIED_DATE}
                value={dayjs(app?.appliedAt || app?.createdAt).format('DD/MM/YYYY')}
              />
              <DetailBox
                icon={<Clock className="size-3" />}
                label={STUDENT_APPLICATIONS_UI.STATS.UPDATE_HISTORY}
                value={dayjs(sortedHistories[0]?.changedAt || app?.appliedAt).format(
                  'DD/MM/YYYY HH:mm'
                )}
              />
            </div>

            {/* Submitted Document Card */}
            {!isUniAssign && app?.cvUrl && (
              <div className="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-rose-100 hover:shadow-md">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <FileText className="size-3" />
                  {STUDENT_APPLICATIONS_UI.STATS.SUBMITTED_DOCS}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                      <FileText className="size-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="max-w-[180px] truncate text-sm font-black text-slate-700">
                        {STUDENT_APPLICATIONS_UI.COMMON.REPLICATE_CV.replace(
                          '{name}',
                          app?.studentName || 'Resume'
                        ).replace('{year}', dayjs(app?.appliedAt).format('YYYY'))}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {STUDENT_APPLICATIONS_UI.COMMON.FILE_FORMAT.replace(
                          '{size}',
                          '1.2 MB'
                        ).replace('{format}', 'PDF')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100">
                      <Eye className="size-4" />
                    </button>
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-all hover:bg-slate-800"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-4">
            {!isUniAssign && app?.status === APPLICATION_STATUS.APPLIED && (
              <button
                onClick={onWithdrawClick}
                className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-rose-50 py-4 text-sm font-black uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-100"
              >
                <LogOut className="size-4" />
                {STUDENT_APPLICATIONS_UI.STATS.WITHDRAW_REGISTRATION}
              </button>
            )}
            {(app?.status === APPLICATION_STATUS.REJECTED ||
              app?.status === APPLICATION_STATUS.WITHDRAWN) && (
              <button
                onClick={onHideClick}
                className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-slate-50 py-4 text-sm font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-100"
              >
                <Trash2 className="size-4" />
                {STUDENT_APPLICATIONS_UI.ACTIONS.HIDE}
              </button>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const DetailBox = ({ icon, label, value }) => (
  <div className="flex flex-col gap-2 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
      {icon}
      {label}
    </div>
    <span className="text-base font-black text-slate-700">{value}</span>
  </div>
);

export default StudentApplicationDetailModal;
