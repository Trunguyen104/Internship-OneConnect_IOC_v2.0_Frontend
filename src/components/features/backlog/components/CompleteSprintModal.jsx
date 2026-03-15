'use client';

import { useState, useMemo } from 'react';
import { SPRINT_STATUS, WORK_ITEM_STATUS, MOVE_INCOMPLETE_ITEMS_OPTION } from '@/constants/enums';
import { BACKLOG_UI } from '@/constants/backlog';

export default function CompleteSprintModal({ open, sprint, sprints, onClose, onSubmit }) {
  const [moveOption, setMoveOption] = useState('backlog'); // Mặc định chọn Backlog cho an toàn
  const [userSelectedNextSprintId, setUserSelectedNextSprintId] = useState(null);
  const [newSprintName, setNewSprintName] = useState('');

  const sprintItems = sprint?.items || [];
  const undoneItems = sprintItems.filter((it) => {
    const status = it.status?.name || it.status;
    return status !== WORK_ITEM_STATUS.DONE && status !== 'DONE';
  });

  // SỬA LỖI: Lọc Sprint dự kiến (Chấp nhận cả khi status bị null/undefined như trong log của bạn)
  const futureSprints = useMemo(() => {
    return (sprints || []).filter(
      (s) =>
        s.sprintId !== sprint?.sprintId &&
        (!s.status ||
          s.status === SPRINT_STATUS.PLANNED ||
          (typeof s.status === 'string' && s.status.toUpperCase() === 'PLANNED')),
    );
  }, [sprints, sprint]);

  const selectedNextSprintId = userSelectedNextSprintId ?? futureSprints[0]?.sprintId ?? '';

  if (!open) return null;

  const handleSubmit = () => {
    let option = MOVE_INCOMPLETE_ITEMS_OPTION.TO_BACKLOG;
    let targetId = null;

    if (moveOption === 'next') {
      option = MOVE_INCOMPLETE_ITEMS_OPTION.TO_NEXT_PLANNED_SPRINT;
      targetId = selectedNextSprintId;
    } else if (moveOption === 'new') {
      option = MOVE_INCOMPLETE_ITEMS_OPTION.CREATE_NEW_SPRINT;
    }

    // Gửi đúng 3 trường Backend cần để xử lý logic "quăng" issue
    onSubmit?.({
      incompleteItemsOption: option,
      targetSprintId: targetId,
      newSprintName: moveOption === 'new' ? newSprintName : '',
    });
  };

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'>
      <div className='relative flex w-full max-w-[500px] flex-col rounded-3xl bg-white p-8 shadow-2xl'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>
          {BACKLOG_UI.COMPLETE_SPRINT_TITLE} {sprint?.name}
        </h2>
        <p className='mb-6 text-sm font-medium text-gray-500'>
          Có {undoneItems.length} {BACKLOG_UI.INCOMPLETE_ISSUES_PROMPT}
        </p>

        <div className='mb-8 space-y-4'>
          {/* 1. Quăng ra Backlog */}
          <label className='flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:bg-gray-50'>
            <input
              type='radio'
              checked={moveOption === 'backlog'}
              onChange={() => setMoveOption('backlog')}
              className='text-primary focus:ring-primary h-4 w-4'
            />
            <span className='text-sm font-semibold text-gray-700'>
              {BACKLOG_UI.OPT_PRODUCT_BACKLOG}
            </span>
          </label>

          {/* 2. Quăng sang Sprint kế tiếp */}
          <div className='space-y-2'>
            <label className='flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:bg-gray-50'>
              <input
                type='radio'
                checked={moveOption === 'next'}
                onChange={() => setMoveOption('next')}
                className='text-primary focus:ring-primary h-4 w-4'
              />
              <span className='text-sm font-semibold text-gray-700'>
                {BACKLOG_UI.OPT_NEXT_SPRINT}
              </span>
            </label>
            {moveOption === 'next' && (
              <div className='animate-in slide-in-from-left-2 ml-9'>
                <select
                  value={selectedNextSprintId}
                  onChange={(e) => setUserSelectedNextSprintId(e.target.value)}
                  className='focus:border-primary h-10 w-full rounded-xl border border-gray-200 px-3 text-sm font-medium transition-all outline-none'
                >
                  {futureSprints.map((s) => (
                    <option key={s.sprintId} value={s.sprintId}>
                      {s.name || s.title}
                    </option>
                  ))}
                  {futureSprints.length === 0 && (
                    <option value=''>{BACKLOG_UI.NO_PLANNED_SPRINT}</option>
                  )}
                </select>
              </div>
            )}
          </div>
          {/* 3. Quăng vô Sprint mới tạo */}
          {/* 3. Quăng vô Sprint mới tạo */}
          <div className='space-y-2'>
            <label className='flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:bg-gray-50'>
              <input
                type='radio'
                checked={moveOption === 'new'}
                onChange={() => setMoveOption('new')}
                className='text-primary focus:ring-primary h-4 w-4'
              />
              <span className='text-sm font-semibold text-gray-700'>
                {BACKLOG_UI.OPT_NEW_SPRINT}
              </span>
            </label>
            {moveOption === 'new' && (
              <div className='animate-in slide-in-from-left-2 ml-9'>
                <input
                  type='text'
                  placeholder={BACKLOG_UI.PLACEHOLDER_NEW_SPRINT}
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  className='border-primary/20 bg-primary-50/20 focus:ring-primary/20 h-10 w-full rounded-xl border px-4 text-sm outline-none focus:ring-2'
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end gap-3 border-t border-gray-100 pt-6'>
          <button
            onClick={onClose}
            className='h-11 rounded-full px-6 font-bold text-gray-500 hover:bg-gray-100'
          >
            {BACKLOG_UI.CANCEL}
          </button>
          <button
            onClick={handleSubmit}
            disabled={moveOption === 'new' && !newSprintName.trim()}
            className='bg-primary hover:bg-primary-hover h-11 rounded-full px-8 font-bold text-white shadow-lg disabled:opacity-50'
          >
            {BACKLOG_UI.COMPLETE_SPRINT}
          </button>
        </div>
      </div>
    </div>
  );
}
