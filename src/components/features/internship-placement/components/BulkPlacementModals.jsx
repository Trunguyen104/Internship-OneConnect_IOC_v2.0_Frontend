'use client';

import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Divider, List, message, Modal, Tooltip } from 'antd';
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
  const UI = PLACEMENT_UI_TEXT.MODALS.BULK_ASSIGN;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.bulkAssign(data),
    onSuccess: (res) => {
      if (res?.success === false) {
        message.error(res?.message || 'Selected phase has insufficient capacity.');
      } else {
        message.success(`Assignment requested for ${selectedStudents.length} students.`);
        onClose();
        queryClient.invalidateQueries(['semester-students', semesterId]);
        queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
      }
    },
    onError: (err) => message.error(err?.message || 'Failed to bulk assign.'),
  });

  const conflicts = useMemo(() => {
    if (!selectedPhase) return [];
    return selectedStudents.filter((s) =>
      s.activeSelfApplyEnterpriseIds?.includes(selectedPhase.enterpriseId)
    );
  }, [selectedPhase, selectedStudents]);

  const isOverCapacity = selectedPhase && selectedStudents.length > selectedPhase.remainingCapacity;

  const handleConfirm = () => {
    if (!selectedPhase) return message.warning('Please select a phase.');
    if (isOverCapacity) {
      return message.error('Phase capacity exceeded.');
    }
    if (conflicts.length > 0) {
      return message.error('Some students have active self-apply conflicts with this enterprise.');
    }
    mutation.mutate({
      studentIds: selectedStudents.map((s) => s.id),
      internPhaseId: selectedPhase.internPhaseId || selectedPhase.id,
    });
  };

  return (
    <Modal
      title={<span className="text-lg font-bold">{UI.TITLE(selectedStudents.length)}</span>}
      open={visible}
      onCancel={onClose}
      destroyOnHidden
      width={560}
      footer={[
        <Button key="cancel" variant="muted" onClick={onClose} className="mr-2">
          {UI.CANCEL}
        </Button>,
        <Button
          key="confirm"
          variant="primary"
          loading={mutation.isLoading}
          onClick={handleConfirm}
          disabled={!selectedPhase || isOverCapacity || conflicts.length > 0}
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
            message={
              <span className="text-xs font-semibold">
                {UI.CAPACITY_ERROR(selectedPhase.remainingCapacity)}
              </span>
            }
          />
        )}

        {conflicts.length > 0 && (
          <Alert
            type="warning"
            showIcon
            message={
              <span className="text-xs font-semibold">{UI.CONFLICT_MSG(conflicts.length)}</span>
            }
            description={<span className="text-[10px]">{UI.CONFLICT_DESC}</span>}
          />
        )}

        <Divider plain>
          <span className="text-xs text-slate-400">{UI.STUDENTS_LABEL}</span>
        </Divider>
        <div className="max-h-[300px] overflow-auto rounded-lg border border-slate-100 bg-slate-50 p-1">
          <List
            size="small"
            dataSource={selectedStudents}
            renderItem={(student) => {
              const hasConflict = conflicts.some((c) => c.id === student.id);
              return (
                <List.Item
                  className={`border-none py-1.5 px-3 rounded transition-colors group ${
                    hasConflict ? 'bg-amber-50/50' : 'hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between w-full items-center">
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          hasConflict ? 'text-amber-700' : 'text-slate-700'
                        }`}
                      >
                        {student.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {student.studentCode || student.studentId}
                      </span>
                    </div>
                    {hasConflict && (
                      <Tooltip title={`Active self-apply at ${selectedPhase.enterpriseName}`}>
                        <ExclamationCircleOutlined className="text-amber-500" />
                      </Tooltip>
                    )}
                  </div>
                </List.Item>
              );
            }}
          />
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
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const UI = PLACEMENT_UI_TEXT.MODALS.BULK_REASSIGN;
  const queryClient = useQueryClient();

  const eligibleStudents = useMemo(
    () => selectedStudents.filter((s) => !s.hasInternshipData),
    [selectedStudents]
  );
  const blockedStudents = useMemo(
    () => selectedStudents.filter((s) => s.hasInternshipData),
    [selectedStudents]
  );

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.reassignStudent(data),
    onSuccess: () => {
      message.success(`Re-assigned ${eligibleStudents.length} students.`);
      onClose();
      queryClient.invalidateQueries(['semester-students', semesterId]);
      queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
    },
    onError: (err) => message.error(err?.message || 'Failed to re-assign.'),
  });

  const handleConfirm = () => {
    if (!selectedPhaseId) return message.warning('Please select a new phase.');
    if (eligibleStudents.length === 0) return;
    mutation.mutate({
      studentIds: eligibleStudents.map((s) => s.id),
      internPhaseId: selectedPhaseId,
    });
  };

  return (
    <Modal
      title={<span className="text-lg font-bold text-slate-800">{UI.TITLE}</span>}
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
          disabled={eligibleStudents.length === 0}
        >
          {UI.CONFIRM}
        </Button>,
      ]}
    >
      <div className="py-4 space-y-6">
        <Alert
          message={<span className="text-sm font-medium">{UI.IMPACT_TITLE}</span>}
          description={UI.IMPACT_DESC}
          type="info"
          showIcon
          className="rounded-lg shadow-sm"
        />

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {UI.TARGET_LABEL}
          </label>
          <EnterprisePhaseSelect
            semesterId={semesterId}
            value={selectedPhaseId}
            onChange={setSelectedPhaseId}
            termName={termName}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-success uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              {UI.ELIGIBLE_LABEL(eligibleStudents.length)}
            </div>
            <div className="rounded-lg border border-success/10 bg-success-surface/10 p-2 max-h-[160px] overflow-auto">
              <List
                size="small"
                dataSource={eligibleStudents}
                renderItem={(s) => (
                  <List.Item className="border-none py-1 text-xs">
                    <span className="font-medium text-slate-700">{s.fullName}</span>
                    <span className="text-slate-400 mx-2">{UI.ARROW}</span>
                    <span className="text-slate-500 italic truncate ml-auto">
                      {s.currentEnterprise || UI.CURRENT_ENTERPRISE_FALLBACK}
                    </span>
                  </List.Item>
                )}
              />
            </div>
          </div>

          {blockedStudents.length > 0 && (
            <div className="space-y-2 opacity-80">
              <div className="flex items-center gap-2 text-xs font-bold text-danger uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
                {UI.BLOCKED_LABEL(blockedStudents.length)}
              </div>
              <div className="rounded-lg border border-danger/10 bg-danger-surface/10 p-2 max-h-[120px] overflow-auto">
                <List
                  size="small"
                  dataSource={blockedStudents}
                  renderItem={(s) => (
                    <List.Item className="border-none py-1 text-xs items-start">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{s.fullName}</span>
                        <span className="text-[9px] text-danger font-semibold uppercase tracking-tighter">
                          {UI.BLOCKED_REASON}
                        </span>
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
 */
export const BulkUnassignModal = ({ visible, onClose, selectedStudents, semesterId }) => {
  const UI = PLACEMENT_UI_TEXT.MODALS.BULK_UNASSIGN;
  const queryClient = useQueryClient();
  const eligibleStudents = useMemo(
    () => selectedStudents.filter((s) => s.status !== 0 && !s.hasInternshipData),
    [selectedStudents]
  );

  const mutation = useMutation({
    mutationFn: (data) => PlacementService.unassignStudents(data),
    onSuccess: () => {
      message.success(`Canceled placements for ${eligibleStudents.length} students.`);
      onClose();
      queryClient.invalidateQueries(['semester-students', semesterId]);
      queryClient.invalidateQueries(['uni-assign-applications', semesterId]);
    },
    onError: (err) => message.error(err?.message || 'Failed to cancel placement.'),
  });

  const handleConfirm = () => {
    if (eligibleStudents.length === 0) return;
    mutation.mutate({ studentIds: eligibleStudents.map((s) => s.id) });
  };

  return (
    <Modal
      title={<span className="text-lg font-bold text-danger">{UI.TITLE}</span>}
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
          disabled={eligibleStudents.length === 0}
        >
          {UI.CONFIRM}
        </Button>,
      ]}
    >
      <div className="py-4 space-y-6">
        <div className="flex gap-4 p-4 rounded-xl bg-danger-surface/5 border border-danger/10">
          <InfoCircleOutlined className="text-xl text-danger mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-800 underline decoration-danger/30 offset-2">
              {UI.WARNING_TITLE}
            </div>
            <div className="text-[13px] text-slate-600 leading-relaxed">{UI.WARNING_DESC}</div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">
            {UI.ELIGIBLE_LABEL}
          </label>
          <div className="max-h-[220px] overflow-auto border rounded-xl divide-y bg-white">
            {eligibleStudents.length > 0 ? (
              eligibleStudents.map((s) => (
                <div key={s.id} className="p-3 flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">{s.fullName}</span>
                  <Badge variant="warning-soft" size="xs">
                    {s.placementStatus || 'Active'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm italic">
                {UI.EMPTY_ELIGIBLE}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
