'use client';

import { RocketOutlined } from '@ant-design/icons';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

import { useCreateSprint } from '../hooks/useCreateSprint';
import { BacklogItemSelector } from './BacklogItemSelector';

function FieldLabel({ required, children }) {
  return (
    <div className="text-[13px] font-bold tracking-wide text-text/80 uppercase mb-2 ml-1">
      {children}
      {required ? <span className="text-rose-500"> *</span> : null}
    </div>
  );
}

export default function CreateSprintModal({ open, projectId, onClose, onSubmit }) {
  const {
    sprintName,
    setSprintName,
    goal,
    setGoal,
    selectedEpicId,
    setSelectedEpicId,
    selectedItemIds,
    allEpics,
    loadingItems,
    filteredItems,
    isAllFilteredSelected,
    toggleSelection,
    toggleAll,
    reset,
    canSubmit,
  } = useCreateSprint(projectId, open);

  function handleClose() {
    onClose?.();
  }

  function handleSubmit() {
    if (!canSubmit) return;

    const payload = {
      name: sprintName.trim(),
    };
    if (goal) payload.goal = goal;
    if (selectedItemIds.length > 0) {
      payload.workItemIds = selectedItemIds;
    }

    onSubmit?.(payload);
    reset();
    onClose?.();
  }

  return (
    <CompoundModal open={open} onCancel={handleClose} width={900}>
      <CompoundModal.Header
        title={BACKLOG_UI.CREATE_SPRINT_NEW}
        subtitle="Lên kế hoạch cho sprint tiếp theo và lựa chọn các công việc ưu tiên từ backlog"
        icon={<RocketOutlined />}
      />

      <CompoundModal.Content className="px-6">
        <div className="flex flex-col gap-8 md:flex-row pb-2">
          {/* Left Column: Details */}
          <div className="flex w-full md:w-[320px] shrink-0 flex-col space-y-6">
            <div className="flex flex-col">
              <FieldLabel required>{BACKLOG_UI.FIELD_SPRINT_NAME}</FieldLabel>
              <Input
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_NAME}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
            </div>

            <div className="flex flex-col flex-1">
              <FieldLabel>{BACKLOG_UI.FIELD_SPRINT_GOAL}</FieldLabel>
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_GOAL}
                className="min-h-[160px] flex-1 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
            </div>
          </div>

          {/* Right Column: Item Selector */}
          <div className="flex-1 min-w-0">
            <BacklogItemSelector
              allEpics={allEpics}
              selectedEpicId={selectedEpicId}
              setSelectedEpicId={setSelectedEpicId}
              loadingItems={loadingItems}
              filteredItems={filteredItems}
              selectedItemIds={selectedItemIds}
              toggleSelection={toggleSelection}
              toggleAll={toggleAll}
              isAllFilteredSelected={isAllFilteredSelected}
            />
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={handleClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL}
        confirmText={BACKLOG_UI.CREATE_SPRINT}
        disabled={!canSubmit}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}
