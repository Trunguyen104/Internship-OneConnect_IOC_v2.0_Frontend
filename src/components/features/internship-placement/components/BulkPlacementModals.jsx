'use client';

import {
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, List, Modal, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import {
  APPLICATION_STATUS,
  PLACEMENT_STATUS,
  PLACEMENT_UI_TEXT,
} from '@/constants/internship-placement/placement.constants';
import { useToast } from '@/providers/ToastProvider';

import { PlacementService } from '../services/placement.service';
import EnterprisePhaseSelect from './EnterprisePhaseSelect';

/**
 * AC-02: Bulk Assign Modal.
 * handles capacity validation and student preview.
 */
export const BulkAssignModal = ({ visible, onClose, selectedStudents, semesterId, termName }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [excludedIds, setExcludedIds] = useState(new Set());

  const UI = PLACEMENT_UI_TEXT.MODALS.BULK_ASSIGN;
  const queryClient = useQueryClient();
  const toast = useToast();

  const activeStudents = useMemo(
    () => selectedStudents.filter((s) => !excludedIds.has(s.id)),
    [selectedStudents, excludedIds]
  );

  const { eligibleStudents, blockedStudents } = useMemo(() => {
    if (!selectedPhase) return { eligibleStudents: activeStudents, blockedStudents: [] };

    const eligible = [];
    const blocked = [];

    activeStudents.forEach((student) => {
      const conflictApp = student.selfApplyApplications?.find(
        (app) =>
          app.enterpriseId === selectedPhase.enterpriseId &&
          ([
            APPLICATION_STATUS.APPLIED,
            APPLICATION_STATUS.INTERVIEWING,
            APPLICATION_STATUS.OFFERED,
          ].includes(app.status) ||
            ['Applied', 'Interviewing', 'Offered'].includes(app.statusLabel))
      );

      if (conflictApp) {
        blocked.push({ ...student, conflictStatus: conflictApp.statusLabel });
      } else {
        eligible.push(student);
      }
    });

    return { eligibleStudents: eligible, blockedStudents: blocked };
  }, [selectedPhase, activeStudents]);

  const reassignCount = useMemo(
    () =>
      eligibleStudents.filter(
        (s) =>
          s.placementStatus === PLACEMENT_STATUS.PENDING_ASSIGNMENT ||
          s.placementStatus === PLACEMENT_STATUS.PLACED
      ).length,
    [eligibleStudents]
  );

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.bulkAssign(data),
    onSuccess: (res) => {
      if (res?.success === false) {
        toast.error(res?.message || 'Selected phase has insufficient capacity.');
      } else {
        const entName = selectedPhase?.enterpriseName || 'Enterprise';
        toast.success(UI.BULK_SUCCESS(entName, eligibleStudents.length));
        onClose();
        queryClient.invalidateQueries(['semester-students', semesterId]);
        queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
      }
    },
    onError: (err) => toast.error(err?.message || 'Failed to bulk assign.'),
  });

  const isOverCapacity =
    selectedPhase && eligibleStudents.length > (selectedPhase.remainingCapacity || 0);

  const handleConfirm = () => {
    if (!selectedPhase || eligibleStudents.length === 0 || isOverCapacity) return;
    mutation.mutate({
      studentIds: eligibleStudents.map((s) => s.studentId || s.id),
      enterpriseId: selectedPhase.enterpriseId,
      internPhaseId: selectedPhase.internPhaseId || selectedPhase.id,
    });
  };

  const onExclude = (id) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-surface flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <UserOutlined className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text leading-tight">
              {UI.TITLE(eligibleStudents.length)}
            </span>
            <span className="text-xs font-medium text-muted">{UI.REVIEW_SUBTITLE}</span>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      destroyOnHidden
      width={540}
      centered
      className="premium-modal"
      footer={[
        <Button key="cancel" variant="muted" onClick={onClose} className="mr-2">
          {UI.CANCEL}
        </Button>,
        <Button
          key="confirm"
          variant="primary"
          loading={mutation.isLoading}
          onClick={handleConfirm}
          disabled={!selectedPhase || eligibleStudents.length === 0 || isOverCapacity}
        >
          {UI.CONFIRM}
        </Button>,
      ]}
    >
      <div className="py-2 space-y-3">
        <div className="bg-bg/50 p-3 rounded-2xl border border-border/50">
          <label className="block text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2 pl-1">
            {UI.TARGET_LABEL}
          </label>
          <EnterprisePhaseSelect
            semesterId={semesterId}
            value={selectedPhase?.internPhaseId || selectedPhase?.id}
            onChange={(id, phase) => setSelectedPhase(phase)}
            termName={termName}
          />
        </div>

        {isOverCapacity && (
          <Alert
            type="error"
            className="py-1.5 px-3 rounded-xl border-none bg-danger-surface/50"
            message={
              <div className="flex items-center gap-2 text-danger">
                <ExclamationCircleOutlined className="text-xs" />
                <span className="text-[11px] font-bold leading-tight">
                  {UI.CAPACITY_ERROR(
                    selectedPhase.internPhaseName || selectedPhase.phaseName,
                    selectedPhase.enterpriseName,
                    selectedPhase.remainingCapacity,
                    eligibleStudents.length
                  )}
                </span>
              </div>
            }
          />
        )}

        {reassignCount > 0 && !isOverCapacity && (
          <Alert
            type="warning"
            className="py-1.5 px-3 rounded-xl border-none bg-warning-surface/50"
            message={
              <div className="flex items-center gap-2 text-warning">
                <InfoCircleOutlined className="text-xs" />
                <span className="text-[11px] font-bold">{UI.REASSIGN_WARNING(reassignCount)}</span>
              </div>
            }
          />
        )}

        {blockedStudents.length > 0 && (
          <Alert
            type="error"
            showIcon
            title={
              <span className="text-xs font-semibold">
                {UI.CONFLICT_MSG(blockedStudents.length)}
              </span>
            }
            description={<span className="text-[10px]">{UI.CONFLICT_DESC}</span>}
          />
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 block pl-1">
              {UI.ELIGIBLE_LABEL(eligibleStudents.length)}
            </label>
            <div className="max-h-[220px] overflow-auto pr-1 custom-scrollbar">
              {eligibleStudents.length > 0 ? (
                <div className="grid gap-2">
                  {eligibleStudents.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 bg-surface border border-border/50 rounded-xl flex justify-between items-center group transition-all hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          size={32}
                          className="bg-muted/10 text-muted border-none text-[11px] font-bold shrink-0"
                        >
                          {s.fullName?.charAt(0)}
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-text truncate">
                            {s.fullName}
                          </span>
                          <span className="text-[10px] text-muted truncate tracking-tight">
                            {s.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col items-end gap-1">
                          {s.placementStatus === PLACEMENT_STATUS.PLACED && (
                            <StatusBadge
                              variant="success"
                              label={s.enterpriseName || PLACEMENT_UI_TEXT.STATUS_LABELS.PLACED}
                              variantType="boxed"
                              className="scale-90 origin-right"
                            />
                          )}
                          {s.placementStatus === PLACEMENT_STATUS.PENDING_ASSIGNMENT && (
                            <StatusBadge
                              variant="warning"
                              label={PLACEMENT_UI_TEXT.STATUS_LABELS.PENDING}
                              variantType="boxed"
                              className="scale-90 origin-right"
                            />
                          )}
                        </div>
                        <Tooltip title={UI.EXCLUDE_TOOLTIP}>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-7 w-7 text-muted/40 hover:text-danger hover:bg-danger-surface rounded-lg transition-colors border-none"
                            onClick={() => onExclude(s.id)}
                          >
                            <CloseOutlined className="text-[10px]" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 bg-bg/50 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center px-8">
                  <div className="w-12 h-12 bg-surface rounded-full shadow-sm flex items-center justify-center mb-4">
                    <InfoCircleOutlined className="text-xl text-muted/40" />
                  </div>
                  <p className="text-muted text-xs font-medium leading-relaxed max-w-[240px]">
                    {selectedPhase ? UI.EMPTY_ELIGIBLE : UI.PROMPT_SELECT}
                  </p>
                </div>
              )}
            </div>
          </div>

          {blockedStudents.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-danger uppercase tracking-[0.2em] mb-1 block pl-1">
                {UI.BLOCKED_LABEL(blockedStudents.length)}
              </label>
              <div className="max-h-[160px] overflow-auto border border-danger/20 rounded-xl divide-y bg-danger-surface/40">
                {blockedStudents.map((s) => (
                  <div key={s.id} className="p-3 flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text line-through decoration-danger/30">
                        {s.fullName}
                      </span>
                      <span className="text-[10px] text-danger font-bold">
                        {UI.CONFLICT_REASON(s.conflictStatus)}
                      </span>
                    </div>
                    <StatusBadge
                      variant="danger"
                      label={PLACEMENT_UI_TEXT.STATUS_LABELS.BLOCKED}
                      variantType="boxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

/**
 * AC-03: Bulk Reassign Modal.
 * handles filtering of eligible vs blocked students.
 */
export const BulkReassignModal = ({ visible, onClose, selectedStudents, semesterId, termName }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [excludedIds, setExcludedIds] = useState(new Set());

  const UI = PLACEMENT_UI_TEXT.MODALS.BULK_REASSIGN;
  const queryClient = useQueryClient();
  const toast = useToast();

  const eligibleStudentsRaw = useMemo(
    () => selectedStudents.filter((s) => !s.hasInternshipData),
    [selectedStudents]
  );

  const blockedStudents = useMemo(
    () => selectedStudents.filter((s) => s.hasInternshipData),
    [selectedStudents]
  );

  const activeStudents = useMemo(
    () => eligibleStudentsRaw.filter((s) => !excludedIds.has(s.id)),
    [eligibleStudentsRaw, excludedIds]
  );

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.reassignStudents(data),
    onSuccess: () => {
      const entName = selectedPhase?.enterpriseName || 'Enterprise';
      toast.success(UI.SUCCESS(entName, activeStudents.length));
      onClose();
      queryClient.invalidateQueries(['semester-students', semesterId]);
      queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
    },
    onError: (err) => toast.error(err?.message || 'Failed to re-assign.'),
  });

  const handleConfirm = () => {
    if (!selectedPhase) return toast.warning('Please select a new phase.');
    if (activeStudents.length === 0) return;
    mutation.mutate({
      studentIds: activeStudents.map((s) => s.studentId || s.id),
      newEnterpriseId: selectedPhase.enterpriseId,
      newInternPhaseId: selectedPhase.internPhaseId || selectedPhase.id,
    });
  };

  const toggleExclude = (id) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isAllBlocked = eligibleStudentsRaw.length === 0;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning-surface flex items-center justify-center text-warning">
            <ExclamationCircleOutlined className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text leading-tight">
              {UI.TITLE(activeStudents.length)}
            </span>
            <span className="text-xs font-medium text-muted">{UI.SUBTITLE}</span>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      destroyOnHidden
      width={540}
      centered
      footer={[
        <Button key="cancel" variant="muted" onClick={onClose} className="mr-2">
          {UI.CANCEL}
        </Button>,
        <Button
          key="confirm"
          variant="primary"
          loading={mutation.isLoading}
          onClick={handleConfirm}
          disabled={activeStudents.length === 0 || isAllBlocked}
        >
          {UI.CONFIRM}
        </Button>,
      ]}
    >
      <div className="py-2 space-y-4">
        {isAllBlocked ? (
          <Alert
            type="error"
            className="py-2 px-3 rounded-xl border-none bg-red-50/50"
            message={
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-danger">
                  <ExclamationCircleOutlined className="text-xs" />
                  <span className="text-[11px] font-bold">{UI.ALL_BLOCKED_ERROR}</span>
                </div>
                <span className="text-[10px] text-danger/70 mt-0.5 ml-5">{UI.BLOCKED_REASON}</span>
              </div>
            }
          />
        ) : (
          <Alert
            type="info"
            className="py-2 px-3 rounded-xl border-none bg-info-surface"
            message={
              <div className="flex items-center gap-2 text-info">
                <InfoCircleOutlined className="text-xs shrink-0" />
                <span className="text-[11px] font-bold leading-tight">
                  {UI.REASSIGN_INFO(activeStudents.length)}
                </span>
              </div>
            }
          />
        )}

        {!isAllBlocked && (
          <div className="bg-bg/50 p-3 rounded-2xl border border-border/50">
            <label className="block text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2 pl-1">
              {UI.TARGET_LABEL}
            </label>
            <EnterprisePhaseSelect
              semesterId={semesterId}
              value={selectedPhase?.internPhaseId || selectedPhase?.id}
              onChange={(id, phase) => setSelectedPhase(phase)}
              termName={termName}
            />
          </div>
        )}

        <div className="space-y-4">
          {!isAllBlocked && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-success uppercase tracking-[0.2em] pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                {UI.ELIGIBLE_LABEL(activeStudents.length)}
              </div>
              <div className="grid gap-2 max-h-[240px] overflow-auto pr-1 custom-scrollbar">
                {eligibleStudentsRaw.map((s) => {
                  const isExcluded = excludedIds.has(s.id);
                  return (
                    <div
                      key={s.id}
                      className={`p-2.5 bg-surface border rounded-xl flex justify-between items-center group transition-all ${
                        isExcluded
                          ? 'opacity-40 grayscale border-border/50'
                          : 'border-border/50 hover:border-success/40 hover:shadow-sm hover:shadow-success/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          size={32}
                          className={`border-none text-[11px] font-bold shrink-0 ${
                            isExcluded
                              ? 'bg-muted/10 text-muted/40'
                              : 'bg-success-surface text-success'
                          }`}
                        >
                          {s.fullName?.charAt(0)}
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-[13px] font-bold truncate ${isExcluded ? 'text-muted/40 line-through' : 'text-text'}`}
                          >
                            {s.fullName}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-muted">
                            <span className="italic truncate max-w-[100px]">
                              {s.enterpriseName || UI.CURRENT_ENTERPRISE_FALLBACK}
                            </span>
                            {!isExcluded && (
                              <div className="flex items-center gap-1 px-1 py-0.5 bg-primary/5 rounded text-[9px] text-primary font-black uppercase tracking-tighter">
                                <span>{UI.ARROW}</span>
                                <span>{PLACEMENT_UI_TEXT.STATUS_LABELS.NEW}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Tooltip
                        title={
                          isExcluded
                            ? PLACEMENT_UI_TEXT.MODALS.COMMON.INCLUDE
                            : PLACEMENT_UI_TEXT.MODALS.COMMON.EXCLUDE
                        }
                      >
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className={`h-7 w-7 rounded-lg transition-colors border-none ${
                            isExcluded
                              ? 'text-primary hover:bg-primary-surface'
                              : 'text-muted/40 hover:text-danger hover:bg-danger-surface'
                          }`}
                          onClick={() => toggleExclude(s.id)}
                        >
                          {isExcluded ? (
                            <InfoCircleOutlined className="text-[10px]" />
                          ) : (
                            <CloseOutlined className="text-[10px]" />
                          )}
                        </Button>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {blockedStudents.length > 0 && (
            <div className={`space-y-2 ${!isAllBlocked ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-danger uppercase tracking-widest pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
                {UI.BLOCKED_LABEL(blockedStudents.length)}
              </div>
              <div className="rounded-xl border border-danger/10 bg-danger-surface/5 p-1 max-h-[120px] overflow-auto">
                <List
                  size="small"
                  dataSource={blockedStudents}
                  renderItem={(s) => (
                    <List.Item className="border-none py-2 px-3 items-start hover:bg-white/50 rounded-lg transition-all">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-muted line-through decoration-danger/20">
                          {s.fullName}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <ExclamationCircleOutlined className="text-[9px] text-danger" />
                          <span className="text-[9px] text-danger font-black uppercase tracking-tighter">
                            {UI.BLOCKED_REASON}
                          </span>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

/**
 * AC-04: Bulk Unassign Modal.
 */ export const BulkUnassignModal = ({ visible, onClose, selectedStudents, semesterId }) => {
  const UI = PLACEMENT_UI_TEXT.MODALS.BULK_UNASSIGN;
  const queryClient = useQueryClient();
  const toast = useToast();

  // AC-04: Exclude already unplaced students from calculations
  const studentsWithPlacements = useMemo(
    () => selectedStudents.filter((s) => s.placementStatus !== PLACEMENT_STATUS.UNPLACED),
    [selectedStudents]
  );

  const eligibleStudents = useMemo(
    () => studentsWithPlacements.filter((s) => !s.hasInternshipData),
    [studentsWithPlacements]
  );

  const blockedStudents = useMemo(
    () => studentsWithPlacements.filter((s) => s.hasInternshipData),
    [studentsWithPlacements]
  );

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.unassignStudents(data),
    onSuccess: () => {
      toast.success(UI.SUCCESS(eligibleStudents.length));
      onClose();
      queryClient.invalidateQueries(['semester-students', semesterId]);
      queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
    },
    onError: (err) => toast.error(err?.message || 'Failed to cancel placement.'),
  });

  const handleConfirm = () => {
    if (eligibleStudents.length === 0) return;
    mutation.mutate({ studentIds: eligibleStudents.map((s) => s.studentId || s.id) });
  };

  const hasPlacements = studentsWithPlacements.length > 0;
  const isAllBlocked = hasPlacements && eligibleStudents.length === 0;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-danger-surface flex items-center justify-center text-danger">
            <CloseOutlined className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text leading-tight">
              {UI.TITLE(eligibleStudents.length)}
            </span>
            <span className="text-xs font-medium text-muted">{UI.SUBTITLE}</span>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      destroyOnHidden
      width={540}
      centered
      footer={[
        <Button key="cancel" variant="muted" onClick={onClose} className="mr-2">
          {UI.CANCEL}
        </Button>,
        <Button
          key="confirm"
          variant="danger"
          loading={mutation.isLoading}
          onClick={handleConfirm}
          disabled={!hasPlacements || isAllBlocked}
        >
          {UI.CONFIRM}
        </Button>,
      ]}
    >
      <div className="py-2 space-y-4">
        {!hasPlacements ? (
          <Alert
            type="error"
            className="py-1.5 px-3 rounded-xl border-none bg-red-50/50"
            message={
              <div className="flex items-center gap-2 text-danger">
                <ExclamationCircleOutlined className="text-xs" />
                <span className="text-[11px] font-bold">{UI.EMPTY_PLACEMENTS_ERROR}</span>
              </div>
            }
          />
        ) : isAllBlocked ? (
          <Alert
            type="error"
            className="py-2 px-3 rounded-xl border-none bg-red-50/50"
            message={
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-danger">
                  <ExclamationCircleOutlined className="text-xs" />
                  <span className="text-[11px] font-bold">{UI.ALL_BLOCKED_ERROR}</span>
                </div>
                <span className="text-[10px] text-danger/70 mt-0.5 ml-5">{UI.BLOCKED_REASON}</span>
              </div>
            }
          />
        ) : (
          <Alert
            type="warning"
            className="py-1.5 px-3 rounded-xl border-none bg-warning-surface/50"
            message={
              <div className="flex items-center gap-2 text-warning">
                <InfoCircleOutlined className="text-xs" />
                <span className="text-[11px] font-bold">
                  {UI.WARNING_TITLE}: {UI.WARNING_DESC}
                </span>
              </div>
            }
          />
        )}

        <div className="space-y-4">
          {eligibleStudents.length > 0 && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block pl-1">
                {UI.ELIGIBLE_LABEL(eligibleStudents.length)}
              </label>
              <div className="grid gap-2 max-h-[240px] overflow-auto pr-1 custom-scrollbar">
                {eligibleStudents.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl flex justify-between items-center group hover:border-red-100 hover:shadow-sm hover:shadow-red-50 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        size={32}
                        className="bg-red-50 text-red-500 border-none text-[11px] font-bold shrink-0"
                      >
                        {s.fullName?.charAt(0)}
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-slate-700 truncate">
                          {s.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate tracking-tight">
                          {UI.CURRENTLY_AT} {s.enterpriseName || 'assigned enterprise'}
                        </span>
                      </div>
                    </div>
                    <StatusBadge
                      variant="danger"
                      label={UI.TO_UNASSIGN}
                      variantType="boxed"
                      className="scale-90 origin-right"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {blockedStudents.length > 0 && (
            <div className={`space-y-1 ${eligibleStudents.length > 0 ? 'opacity-60' : ''}`}>
              <label className="text-[10px] font-black text-danger/60 uppercase tracking-[0.2em] mb-1 block pl-1">
                {UI.BLOCKED_LABEL(blockedStudents.length)}
              </label>
              <div className="max-h-[160px] overflow-auto border border-danger/10 rounded-xl divide-y bg-danger-surface/40">
                {blockedStudents.map((s) => (
                  <div key={s.id} className="p-3 flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text line-through decoration-danger/20">
                        {s.fullName}
                      </span>
                      <span className="text-[9px] text-danger font-bold uppercase tracking-tighter">
                        {PLACEMENT_UI_TEXT.MODALS.BULK_REASSIGN.BLOCKED_REASON}
                      </span>
                    </div>
                    <StatusBadge
                      variant="danger"
                      label={PLACEMENT_UI_TEXT.STATUS_LABELS.BLOCKED_MIXED}
                      variantType="boxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
