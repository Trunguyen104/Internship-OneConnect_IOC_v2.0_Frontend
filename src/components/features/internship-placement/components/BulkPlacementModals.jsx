'use client';

import { CloseOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, List, message, Modal } from 'antd';
import React, { useMemo, useState } from 'react';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { PLACEMENT_UI_TEXT } from '@/constants/internship-placement/placement.constants';

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
          ([1, 2, 3].includes(app.status) ||
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
        (s) => s.placementStatus === 4 || s.placementStatus === 5 || s.placementStatus === 1
      ).length,
    [eligibleStudents]
  );

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.bulkAssign(data),
    onSuccess: (res) => {
      if (res?.success === false) {
        message.error(res?.message || 'Selected phase has insufficient capacity.');
      } else {
        const entName = selectedPhase?.enterpriseName || 'Enterprise';
        message.success(PLACEMENT_UI_TEXT.POPOVER.SUCCESS(entName, eligibleStudents.length));
        onClose();
        queryClient.invalidateQueries(['semester-students', semesterId]);
        queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
      }
    },
    onError: (err) => message.error(err?.message || 'Failed to bulk assign.'),
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
      title={<span className="text-lg font-bold">{UI.TITLE(eligibleStudents.length)}</span>}
      open={visible}
      onCancel={onClose}
      destroyOnHidden
      width={600}
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
      <div className="py-4 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
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
            showIcon
            title={
              <span className="text-xs font-semibold leading-relaxed">
                {UI.CAPACITY_ERROR(
                  selectedPhase.internPhaseName || selectedPhase.phaseName,
                  selectedPhase.enterpriseName,
                  selectedPhase.remainingCapacity,
                  eligibleStudents.length
                )}
              </span>
            }
          />
        )}

        {reassignCount > 0 && !isOverCapacity && (
          <Alert
            type="warning"
            showIcon
            title={
              <span className="text-xs font-semibold">{UI.REASSIGN_WARNING(reassignCount)}</span>
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
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block pl-1">
              {UI.ELIGIBLE_LABEL(eligibleStudents.length)}
            </label>
            <div className="max-h-[220px] overflow-auto border rounded-xl divide-y bg-white">
              {eligibleStudents.length > 0 ? (
                eligibleStudents.map((s) => (
                  <div key={s.id} className="p-3 flex justify-between items-center text-sm group">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{s.fullName}</span>
                      <span className="text-[10px] text-slate-400">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(s.placementStatus === 5 || s.placementStatus === 1) && (
                        <Badge variant="success-soft" size="xs">
                          {s.enterpriseName || 'Placed'}
                        </Badge>
                      )}
                      {s.placementStatus === 4 && (
                        <Badge variant="warning-soft" size="xs">
                          {PLACEMENT_UI_TEXT.STATUS_LABELS.PENDING}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="xs"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onExclude(s.id)}
                      >
                        <CloseOutlined className="text-[10px]" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-300 italic text-sm">
                  {selectedPhase
                    ? 'No eligible students for this enterprise.'
                    : 'Select an enterprise to see eligible students.'}
                </div>
              )}
            </div>
          </div>

          {blockedStudents.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-danger/70 uppercase tracking-[0.2em] mb-1 block pl-1">
                {UI.BLOCKED_LABEL(blockedStudents.length)}
              </label>
              <div className="max-h-[160px] overflow-auto border border-danger/10 rounded-xl divide-y bg-danger-surface/5">
                {blockedStudents.map((s) => (
                  <div key={s.id} className="p-3 flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 line-through decoration-danger/20">
                        {s.fullName}
                      </span>
                      <span className="text-[10px] text-danger font-medium">
                        {UI.CONFLICT_REASON(s.conflictStatus)}
                      </span>
                    </div>
                    <Badge variant="danger-soft" size="xs">
                      {PLACEMENT_UI_TEXT.STATUS_LABELS.BLOCKED}
                    </Badge>
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
      message.success(UI.SUCCESS(entName, activeStudents.length));
      onClose();
      queryClient.invalidateQueries(['semester-students', semesterId]);
      queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
    },
    onError: (err) => message.error(err?.message || 'Failed to re-assign.'),
  });

  const handleConfirm = () => {
    if (!selectedPhase) return message.warning('Please select a new phase.');
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
        <span className="text-lg font-bold text-slate-800">{UI.TITLE(activeStudents.length)}</span>
      }
      open={visible}
      onCancel={onClose}
      destroyOnHidden
      width={640}
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
      <div className="py-4 space-y-6">
        {isAllBlocked ? (
          <Alert
            title={<span className="text-sm font-bold text-danger">{UI.ALL_BLOCKED_ERROR}</span>}
            description={UI.BLOCKED_REASON}
            type="error"
            showIcon
          />
        ) : (
          <Alert
            title={<span className="text-sm font-medium">{UI.IMPACT_TITLE}</span>}
            description={UI.IMPACT_DESC(activeStudents.length)}
            type="info"
            showIcon
            className="rounded-lg shadow-sm"
          />
        )}

        {!isAllBlocked && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
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
              <div className="flex items-center gap-2 text-xs font-bold text-success uppercase tracking-widest pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                {UI.ELIGIBLE_LABEL(activeStudents.length)}
              </div>
              <div className="rounded-xl border border-success/10 bg-success-surface/5 p-1 max-h-[160px] overflow-auto">
                <List
                  size="small"
                  dataSource={eligibleStudentsRaw}
                  renderItem={(s) => {
                    const isExcluded = excludedIds.has(s.id);
                    return (
                      <List.Item
                        className={`border-none py-2 px-3 rounded-lg transition-all group mb-0.5 ${
                          isExcluded ? 'opacity-30 grayscale' : 'hover:bg-white'
                        }`}
                        actions={[
                          <Button
                            key="remove"
                            variant="muted"
                            size="icon-xs"
                            icon={
                              isExcluded ? (
                                <InfoCircleOutlined className="text-primary" />
                              ) : (
                                <CloseOutlined className="text-muted group-hover:text-red-500" />
                              )
                            }
                            onClick={() => toggleExclude(s.id)}
                            className="bg-transparent shadow-none"
                          />,
                        ]}
                      >
                        <div className="flex flex-col flex-1 min-w-0">
                          <span
                            className={`text-[13px] font-bold ${isExcluded ? 'line-through text-slate-400' : 'text-slate-700'}`}
                          >
                            {s.fullName}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="italic truncate max-w-[120px]">
                              {s.enterpriseName || UI.CURRENT_ENTERPRISE_FALLBACK}
                            </span>
                            {!isExcluded && (
                              <>
                                <span className="font-bold text-primary/50">{UI.ARROW}</span>
                                <span className="font-bold text-primary uppercase">
                                  {PLACEMENT_UI_TEXT.STATUS_LABELS.NEW}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
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
                        <span className="text-[11px] font-bold text-slate-600 line-through decoration-danger/20">
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

  // AC-04: Exclude already unplaced students from calculations
  const studentsWithPlacements = useMemo(
    () => selectedStudents.filter((s) => s.placementStatus !== 0),
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
      message.success(UI.SUCCESS(eligibleStudents.length));
      onClose();
      queryClient.invalidateQueries(['semester-students', semesterId]);
      queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
    },
    onError: (err) => message.error(err?.message || 'Failed to cancel placement.'),
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
        <span className="text-lg font-bold text-danger">{UI.TITLE(eligibleStudents.length)}</span>
      }
      open={visible}
      onCancel={onClose}
      destroyOnHidden
      width={520}
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
      <div className="py-4 space-y-6">
        {!hasPlacements ? (
          <Alert
            title={
              <span className="text-sm font-bold text-danger">{UI.EMPTY_PLACEMENTS_ERROR}</span>
            }
            type="error"
            showIcon
          />
        ) : isAllBlocked ? (
          <Alert
            title={<span className="text-sm font-bold text-danger">{UI.ALL_BLOCKED_ERROR}</span>}
            description={PLACEMENT_UI_TEXT.MODALS.BULK_REASSIGN.BLOCKED_REASON}
            type="error"
            showIcon
          />
        ) : (
          <Alert
            title={<span className="text-sm font-medium">{UI.WARNING_TITLE}</span>}
            description={UI.WARNING_DESC}
            type="warning"
            showIcon
            className="rounded-lg shadow-sm"
          />
        )}

        <div className="space-y-4">
          {eligibleStudents.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block pl-1">
                {UI.ELIGIBLE_LABEL(eligibleStudents.length)}
              </label>
              <div className="max-h-[220px] overflow-auto border rounded-xl divide-y bg-white">
                {eligibleStudents.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 flex justify-between items-center text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-700">{s.fullName}</span>
                    <Badge variant="warning-soft" size="xs">
                      {s.enterpriseName || 'Asigned'}
                    </Badge>
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
              <div className="max-h-[160px] overflow-auto border border-danger/10 rounded-xl divide-y bg-danger-surface/5">
                {blockedStudents.map((s) => (
                  <div key={s.id} className="p-3 flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 line-through decoration-danger/20">
                        {s.fullName}
                      </span>
                      <span className="text-[9px] text-danger font-bold uppercase tracking-tighter">
                        {PLACEMENT_UI_TEXT.MODALS.BULK_REASSIGN.BLOCKED_REASON}
                      </span>
                    </div>
                    <Badge variant="danger-soft" size="xs">
                      {PLACEMENT_UI_TEXT.STATUS_LABELS.BLOCKED_MIXED}
                    </Badge>
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
