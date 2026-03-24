'use client';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

import { useCreateSprint } from '../hooks/useCreateSprint';
import { BacklogItemSelector } from './BacklogItemSelector';

function FieldLabel({ required, children }) {
  return (
    <div className="text-text mb-2 text-sm font-semibold">
      {children}
      {required ? <span className="text-primary"> *</span> : null}
    </div>
  );
}

function TextInput({ value, onChange, placeholder = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="border-border focus:border-primary h-11 w-full rounded-2xl border bg-white px-4 text-sm outline-none"
    />
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative flex w-full max-w-[900px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex h-full max-h-[85vh] flex-col">
          <div className="flex shrink-0 justify-center px-8 pt-8 pb-4">
            <div className="text-text text-3xl font-bold">{BACKLOG_UI.CREATE_SPRINT_NEW}</div>
          </div>

          <div className="flex flex-1 flex-col space-y-6 overflow-y-auto px-8 py-2 pb-8">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex w-[40%] flex-col space-y-6">
                <div>
                  <FieldLabel required>{BACKLOG_UI.FIELD_SPRINT_NAME}</FieldLabel>
                  <TextInput
                    value={sprintName}
                    onChange={setSprintName}
                    placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_NAME}
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <FieldLabel>{BACKLOG_UI.FIELD_SPRINT_GOAL}</FieldLabel>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_GOAL}
                    className="border-border focus:border-primary min-h-[140px] w-full flex-1 resize-none rounded-2xl border bg-white p-4 text-sm outline-none"
                  />
                </div>
              </div>

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

          <div className="border-border/20 flex shrink-0 items-center justify-between gap-4 border-t bg-white px-8 py-5">
            <button
              type="button"
              onClick={handleClose}
              className="text-primary bg-primary-50 hover:bg-primary-100 h-12 rounded-full px-10 font-bold transition-colors"
            >
              {BACKLOG_UI.CANCEL}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-primary hover:bg-primary-hover ml-auto h-12 max-w-[400px] flex-1 rounded-full px-8 font-bold text-white transition-opacity disabled:opacity-50"
            >
              {BACKLOG_UI.CREATE_SPRINT}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
