'use client';

import { CheckCircleOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/compoundmodal';
import { Input } from '@/components/ui/input';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Select } from '@/components/ui/select';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import {
  MOVE_INCOMPLETE_ITEMS_OPTION,
  SPRINT_STATUS,
  WORK_ITEM_STATUS,
} from '@/constants/common/enums';

export default function CompleteSprintModal({ open, sprint, sprints, onClose, onSubmit }) {
  const [moveOption, setMoveOption] = useState('backlog'); // Default to Backlog for safety
  const [userSelectedNextSprintId, setUserSelectedNextSprintId] = useState(null);
  const [newSprintName, setNewSprintName] = useState('');

  const sprintItems = sprint?.items || [];
  const undoneItems = sprintItems.filter((it) => {
    const status = it.status?.name || it.status;
    return status !== WORK_ITEM_STATUS.DONE && status !== 'DONE';
  });

  // Filter planned (future) sprints (also accepts null/undefined statuses)
  const futureSprints = useMemo(() => {
    return (sprints || []).filter(
      (s) =>
        s.sprintId !== sprint?.sprintId &&
        (!s.status ||
          s.status === SPRINT_STATUS.PLANNED ||
          (typeof s.status === 'string' && s.status.toUpperCase() === 'PLANNED'))
    );
  }, [sprints, sprint]);

  const selectedNextSprintId = userSelectedNextSprintId ?? futureSprints[0]?.sprintId ?? '';

  const handleSubmit = () => {
    let option = MOVE_INCOMPLETE_ITEMS_OPTION.TO_BACKLOG;
    let targetId = null;

    if (moveOption === 'next') {
      option = MOVE_INCOMPLETE_ITEMS_OPTION.TO_NEXT_PLANNED_SPRINT;
      targetId = selectedNextSprintId;
    } else if (moveOption === 'new') {
      option = MOVE_INCOMPLETE_ITEMS_OPTION.CREATE_NEW_SPRINT;
    }

    // Backend expects these 3 fields to handle incomplete items
    onSubmit?.({
      incompleteItemsOption: option,
      targetSprintId: targetId,
      newSprintName: moveOption === 'new' ? newSprintName : '',
    });
  };

  return (
    <CompoundModal open={open} onCancel={onClose} width={640}>
      <CompoundModal.Header
        title={`${BACKLOG_UI.COMPLETE_SPRINT_TITLE} ${sprint?.name}`}
        subtitle={`${BACKLOG_UI.INCOMPLETE_ISSUES_PROMPT} (${undoneItems.length} cÃ´ng viá»‡c chÆ°a hoÃ n thÃ nh)`}
        icon={<CheckCircleOutlined />}
      />

      <CompoundModal.Content className="px-6">
        <div className="flex flex-col pb-2">
          <RadioGroup
            value={moveOption}
            onChange={(e) => setMoveOption(e.target.value)}
            className="flex flex-col gap-4 w-full"
          >
            {/* 1. Move to backlog */}
            <div
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                moveOption === 'backlog'
                  ? 'border-primary bg-primary/[0.03] shadow-sm'
                  : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50'
              }`}
            >
              <Radio value="backlog" className="font-bold text-[13px] text-gray-700">
                {BACKLOG_UI.OPT_PRODUCT_BACKLOG}
              </Radio>
            </div>

            {/* 2. Move to next planned sprint */}
            <div
              className={`group flex flex-col gap-4 p-4 rounded-xl border transition-all duration-300 ${
                moveOption === 'next'
                  ? 'border-primary bg-primary/[0.03] shadow-sm'
                  : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50'
              }`}
            >
              <Radio value="next" className="font-bold text-[13px] text-gray-700">
                {BACKLOG_UI.OPT_NEXT_SPRINT}
              </Radio>

              {moveOption === 'next' && (
                <div className="animate-in slide-in-from-top-2 duration-300 pl-7">
                  <Select
                    value={selectedNextSprintId}
                    onChange={setUserSelectedNextSprintId}
                    className="h-10 w-full"
                    options={futureSprints.map((s) => ({
                      value: s.sprintId,
                      label: s.name || s.title,
                    }))}
                    placeholder={BACKLOG_UI.NO_PLANNED_SPRINT}
                  />
                </div>
              )}
            </div>

            {/* 3. Move to a new sprint */}
            <div
              className={`group flex flex-col gap-4 p-4 rounded-xl border transition-all duration-300 ${
                moveOption === 'new'
                  ? 'border-primary bg-primary/[0.03] shadow-sm'
                  : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50'
              }`}
            >
              <Radio value="new" className="font-bold text-[13px] text-gray-700">
                {BACKLOG_UI.OPT_NEW_SPRINT}
              </Radio>

              {moveOption === 'new' && (
                <div className="animate-in slide-in-from-top-2 duration-300 pl-7">
                  <Input
                    placeholder={BACKLOG_UI.PLACEHOLDER_NEW_SPRINT}
                    value={newSprintName}
                    onChange={(e) => setNewSprintName(e.target.value)}
                    className="h-10 w-full rounded-xl border-gray-200 bg-white"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </RadioGroup>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL}
        confirmText={BACKLOG_UI.COMPLETE_SPRINT}
        disabled={moveOption === 'new' && !newSprintName.trim()}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}
