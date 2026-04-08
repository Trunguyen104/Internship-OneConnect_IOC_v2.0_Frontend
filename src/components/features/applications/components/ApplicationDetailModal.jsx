'use client';

import { Divider, Modal, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { Calendar, ExternalLink, FileText, Mail, Phone, School, User } from 'lucide-react';
import React from 'react';

import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APPLICATION_STATUS } from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import { useApplicationDetailState } from '../hooks/useApplicationDetailState';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import RejectModal from './RejectModal';

/**
 * Detailed view for an application.
 * Redesigned to be clean, professional, and matching Enterprise Portal standards.
 */
export const ApplicationDetailModal = ({ open, onCancel, applicationId }) => {
  const {
    app,
    isLoading,
    actions,
    rejectModalOpen,
    setRejectModalOpen,
    isUniAssign,
    isSelfApply,
    canAct,
    cvUrl,
    phaseName,
    phaseStart,
    phaseEnd,
    audienceDisplay,
    statusHistories,
    showConfirm,
    onRejectConfirm,
    onRejectClick,
    handleClose,
  } = useApplicationDetailState(applicationId, onCancel);

  const renderActionButtons = () => {
    if (!canAct) return null;

    if (isUniAssign && app?.status === APPLICATION_STATUS.PENDING_ASSIGNMENT) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              showConfirm(
                'Approve Assignment?',
                'Approve this university assignment? This will confirm the student spot at your company.',
                () => actions.approveUniAssign(),
                APPLICATIONS_UI.MODAL.APPROVE_ASSIGNMENT || 'Approve'
              )
            }
            loading={actions.isApprovingUniAssign}
            className="h-11 rounded-2xl bg-slate-900 px-5 font-black uppercase tracking-widest text-white hover:bg-slate-800"
          >
            {APPLICATIONS_UI.MODAL.APPROVE_ASSIGNMENT}
          </Button>
          <Button
            onClick={onRejectClick}
            loading={actions.isRejectingUniAssign}
            variant="destructive"
            className="h-11 rounded-2xl px-5 font-black uppercase tracking-widest"
          >
            {APPLICATIONS_UI.MODAL.REJECT}
          </Button>
        </div>
      );
    }

    if (isSelfApply && app?.status === APPLICATION_STATUS.APPLIED) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              showConfirm(
                'Move to Interviewing?',
                'Move this application to Interviewing stage? This will notify the student.',
                () => actions.moveToInterviewing(),
                APPLICATIONS_UI.MODAL.MOVE_TO_INTERVIEWING || 'Move'
              )
            }
            loading={actions.isInterviewing}
            className="h-11 rounded-2xl bg-slate-900 px-5 font-black uppercase tracking-widest text-white hover:bg-slate-800"
          >
            {APPLICATIONS_UI.MODAL.MOVE_TO_INTERVIEWING}
          </Button>
          <Button
            onClick={onRejectClick}
            loading={actions.isRejecting}
            variant="destructive"
            className="h-11 rounded-2xl px-5 font-black uppercase tracking-widest"
          >
            {APPLICATIONS_UI.MODAL.REJECT}
          </Button>
        </div>
      );
    }

    if (isSelfApply && app?.status === APPLICATION_STATUS.INTERVIEWING) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              showConfirm(
                'Send Offer?',
                'Send an offer to the student? Ensure all internship details are correct first.',
                () => actions.sendOffer(),
                APPLICATIONS_UI.MODAL.SEND_OFFER || 'Send Offer'
              )
            }
            loading={actions.isSendingOffer}
            className="h-11 rounded-2xl bg-slate-900 px-5 font-black uppercase tracking-widest text-white hover:bg-slate-800"
          >
            {APPLICATIONS_UI.MODAL.SEND_OFFER}
          </Button>
          <Button
            onClick={onRejectClick}
            loading={actions.isRejecting}
            variant="destructive"
            className="h-11 rounded-2xl px-5 font-black uppercase tracking-widest"
          >
            {APPLICATIONS_UI.MODAL.REJECT}
          </Button>
        </div>
      );
    }

    if (isSelfApply && app?.status === APPLICATION_STATUS.OFFERED) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              showConfirm(
                'Mark as Placed?',
                'Mark this application as Placed?',
                () => actions.markAsPlaced(),
                APPLICATIONS_UI.MODAL.MARK_PLACED || 'Confirm'
              )
            }
            loading={actions.isMarkingAsPlaced}
            className="h-11 rounded-2xl bg-slate-900 px-5 font-black uppercase tracking-widest text-white hover:bg-slate-800"
          >
            {APPLICATIONS_UI.MODAL.MARK_PLACED}
          </Button>
          <Button
            onClick={onRejectClick}
            loading={actions.isRejecting}
            variant="destructive"
            className="h-11 rounded-2xl px-5 font-black uppercase tracking-widest"
          >
            {APPLICATIONS_UI.MODAL.REJECT}
          </Button>
        </div>
      );
    }

    if (isUniAssign || isSelfApply) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={onRejectClick}
            loading={isUniAssign ? actions.isRejectingUniAssign : actions.isRejecting}
            variant="destructive"
            className="h-11 rounded-2xl px-5 font-black uppercase tracking-widest"
          >
            {APPLICATIONS_UI.MODAL.REJECT}
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        width={860}
        footer={null}
        centered
        className="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-[32px] [&_.ant-modal-content]:p-0 [&_.ant-modal-close]:right-6 [&_.ant-modal-close]:top-6"
      >
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="relative bg-slate-900 px-8 py-6 text-white">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">
                {APPLICATIONS_UI.MODAL.CANDIDATE_PROFILE}
              </span>
              <h2 className="mb-0 text-2xl font-black tracking-tight text-white">
                {isLoading ? <Skeleton.Input active size="large" /> : app?.studentFullName}
              </h2>
            </div>
          </div>

          <div className="space-y-5 px-8 py-6">
            {/* Metadata Row */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                  {APPLICATIONS_UI.MODAL.SOURCE}
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {isLoading
                    ? APPLICATIONS_UI.COMMON.LOADING
                    : isUniAssign
                      ? APPLICATIONS_UI.MODAL.UNI_ASSIGN
                      : APPLICATIONS_UI.MODAL.SELF_APPLY}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                  {APPLICATIONS_UI.COLUMNS.APPLIED_DATE}
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {isLoading
                    ? APPLICATIONS_UI.COMMON.LOADING
                    : dayjs(app?.appliedAt).format(APPLICATIONS_UI.COMMON.DATE_FORMAT)}
                </span>
              </div>
            </div>

            <Divider className="my-0 border-slate-100" />

            {/* Main Info Columns */}
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              <div className="space-y-4">
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
                        {isLoading
                          ? APPLICATIONS_UI.COMMON.LOADING
                          : app?.studentCode || APPLICATIONS_UI.COMMON.EMPTY}
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
                        {isLoading
                          ? APPLICATIONS_UI.COMMON.LOADING
                          : app?.studentEmail || APPLICATIONS_UI.COMMON.EMPTY}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 shadow-sm">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {APPLICATIONS_UI.MODAL.PHONE}
                      </span>
                      <span className="text-sm font-bold text-slate-600">
                        {isLoading
                          ? APPLICATIONS_UI.COMMON.LOADING
                          : app?.studentPhone || APPLICATIONS_UI.COMMON.EMPTY}
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
                        {isLoading
                          ? APPLICATIONS_UI.COMMON.LOADING
                          : app?.schoolName || app?.universityName || APPLICATIONS_UI.COMMON.EMPTY}
                      </span>
                    </div>
                  </div>
                </div>

                <Divider className="my-0 border-slate-100" />

                <div className="space-y-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    {APPLICATIONS_UI.MODAL.STATUS_TIMELINE}
                  </h3>

                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 2 }} />
                  ) : statusHistories.length === 0 ? (
                    <span className="text-sm font-semibold text-slate-500">
                      {APPLICATIONS_UI.COMMON.EMPTY}
                    </span>
                  ) : (
                    <div className="max-h-28 space-y-2 overflow-y-auto pr-2">
                      {statusHistories.map((h, idx) => {
                        const at = h.changedAt || h.createdAt || h.at;
                        const by = h.changedByName || h.changedBy || h.actorName || h.actor;
                        const statusRef =
                          h.toStatus ??
                          h.status ??
                          h.toStatusLabel ??
                          h.statusLabel ??
                          h.statusName;
                        const key = h.id || `hist-${idx}-${at}`;

                        return (
                          <div key={key} className="flex items-start gap-3">
                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-300" />
                            <div className="flex flex-col gap-0.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <ApplicationStatusBadge
                                  status={statusRef}
                                  className="text-[10px] px-2 py-0.5"
                                />
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {at
                                    ? dayjs(at).format('DD MMM, YYYY HH:mm')
                                    : APPLICATIONS_UI.COMMON.EMPTY}
                                </span>
                              </div>
                              {by && (
                                <span className="text-[11px] font-medium text-slate-500">
                                  <span className="font-bold text-slate-700">{String(by)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900">
                  <Calendar className="h-3.5 w-3.5 text-primary" />{' '}
                  {APPLICATIONS_UI.MODAL.APPLYING_FOR}
                </h3>
                <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-primary">
                      {APPLICATIONS_UI.MODAL.JOB_POSITION}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black leading-tight text-slate-800">
                        {isLoading
                          ? APPLICATIONS_UI.COMMON.LOADING
                          : app?.jobPostingTitle || APPLICATIONS_UI.MODAL.GENERAL_APP}
                      </span>
                      {!isLoading && app?.isJobClosed && (
                        <Badge variant="warning-soft" size="xs">
                          {APPLICATIONS_UI.MODAL.CLOSED}
                        </Badge>
                      )}
                      {!isLoading && app?.isJobDeleted && (
                        <Badge variant="danger" size="xs">
                          {APPLICATIONS_UI.MODAL.DELETED}
                        </Badge>
                      )}
                    </div>
                    <span className="mt-2 text-[11px] font-medium text-slate-500">
                      {APPLICATIONS_UI.MODAL.DEPARTMENT}{' '}
                      {app?.departmentName || APPLICATIONS_UI.MODAL.UNSPECIFIED}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {APPLICATIONS_UI.MODAL.INTERN_PHASE}
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {isLoading
                          ? APPLICATIONS_UI.COMMON.LOADING
                          : phaseName || APPLICATIONS_UI.COMMON.EMPTY}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {isLoading || !phaseStart || !phaseEnd
                          ? APPLICATIONS_UI.COMMON.EMPTY
                          : `${dayjs(phaseStart).format(APPLICATIONS_UI.COMMON.DATE_FORMAT)} → ${dayjs(phaseEnd).format(APPLICATIONS_UI.COMMON.DATE_FORMAT)}`}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {APPLICATIONS_UI.MODAL.AUDIENCE}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="info-soft" size="sm">
                          {isLoading ? APPLICATIONS_UI.COMMON.LOADING : audienceDisplay}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {isSelfApply && cvUrl && (
                  <div className="pt-1">
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3 transition-all hover:border-primary/40 hover:bg-primary/10"
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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div>{renderActionButtons()}</div>
              <Button
                onClick={handleClose}
                className="h-11 rounded-2xl bg-slate-900 px-8 font-black uppercase tracking-widest text-white shadow-lg hover:bg-slate-800"
              >
                {APPLICATIONS_UI.MODAL.CLOSE}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <RejectModal
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onConfirm={onRejectConfirm}
        loading={isUniAssign ? actions.isRejectingUniAssign : actions.isRejecting}
        title={
          isUniAssign
            ? APPLICATIONS_UI.MODAL_TITLE.REJECT_UNI
            : APPLICATIONS_UI.MODAL_TITLE.REJECT_STANDARD
        }
      />
    </>
  );
};

export default ApplicationDetailModal;
