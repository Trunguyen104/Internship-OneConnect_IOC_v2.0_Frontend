import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { MoreVertical, Plus, Pencil, Trash2 } from 'lucide-react';
import { WorkItem, ColumnHeaders } from './WorkItem';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { SPRINT_STATUS } from '@/constants/enums';
import { BACKLOG_UI } from '@/constants/backlog';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';

export function SprintSection({
  sprint,
  projectId,
  itemOrders,
  handleSprintActionClick,
  handleDeleteSprint,
  handleDeleteWorkItem,
  setSelectedSprintAction,
  setSelectedTask,
  setOpenUpdateTask,
  setOpenUpdateSprint,
  setActiveSprintForTask,
  setOpenCreateTask,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: sprint.sprintId,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={`mb-6 rounded-3xl border bg-white p-6 shadow-sm transition-colors ${
        isOver ? 'border-primary border-dashed bg-blue-50/50' : 'border-gray-100'
      }`}
    >
      {/* Header */}
      <div className='mb-6 flex items-center pr-1 pl-2'>
        <div className='mr-4 h-4 w-4 flex-shrink-0 rounded border border-gray-300' />
        <h3 className='text-[16px] font-bold text-gray-900'>{sprint.name || sprint.title}</h3>
        <div className='flex-1' />

        {/* Dynamic Start/Complete Sprint button based on status */}
        {sprint.status === SPRINT_STATUS.ACTIVE || sprint.status === 'ACTIVE' ? (
          <button
            onClick={() => handleSprintActionClick(sprint, false)}
            className='flex h-[34px] items-center rounded-full border border-green-200 bg-green-50 px-5 text-[13px] font-medium text-green-700 shadow-sm transition-colors hover:bg-green-100'
          >
            {BACKLOG_UI.COMPLETE_SPRINT}
          </button>
        ) : (
          <button
            onClick={() => handleSprintActionClick(sprint, true)}
            className='flex h-[34px] items-center rounded-full border border-gray-200 bg-white px-5 text-[13px] font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50'
          >
            {BACKLOG_UI.START_SPRINT}
          </button>
        )}

        {/* Custom Dropdown Menu */}
        <div className='relative' ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`ml-3 rounded-full p-1.5 text-gray-500 transition-all outline-none hover:bg-gray-100 ${
              isMenuOpen ? 'ring-primary bg-gray-50 ring-2' : ''
            }`}
          >
            <MoreVertical className='h-4 w-4' />
          </button>

          {isMenuOpen && (
            <div className='animate-in fade-in zoom-in absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl duration-200'>
              <button
                onClick={() => {
                  setSelectedSprintAction(sprint);
                  setOpenUpdateSprint(true);
                  setIsMenuOpen(false);
                }}
                className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-gray-700 transition-colors hover:bg-gray-50'
              >
                <Pencil className='h-4 w-4 text-blue-600' />
                {BACKLOG_UI.EDIT_SPRINT || 'Edit Sprint'}
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  showDeleteConfirm({
                    title: BACKLOG_UI.DELETE_SPRINT || 'Delete Sprint',
                    content:
                      'Are you sure you want to delete this sprint? All items inside will be moved back to the backlog.',
                    onOk: () => handleDeleteSprint(sprint.sprintId),
                    okText: BACKLOG_UI.DELETE || 'Delete',
                    cancelText: BACKLOG_UI.CANCEL || 'Cancel',
                  });
                }}
                className='text-danger flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition-colors hover:bg-red-50'
              >
                <Trash2 className='text-danger h-4 w-4' />
                {BACKLOG_UI.DELETE_SPRINT || 'Delete Sprint'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List Container */}
      <ColumnHeaders />
      <div className='min-h-[20px]'>
        {(sprint.items || []).map((it) => (
          <WorkItem
            key={it.workItemId || it.id}
            it={it}
            itemOrder={itemOrders[it.workItemId || it.id]}
            onDelete={() => handleDeleteWorkItem?.(it.workItemId || it.id)}
            onClick={async (task) => {
              try {
                const res = await productBacklogService.getWorkItemById(
                  projectId,
                  task.workItemId || task.id,
                );
                setSelectedTask(res?.data ? { ...task, ...res.data } : task);
              } catch (e) {
                console.error(e);
                setSelectedTask(task);
              }
              setOpenUpdateTask(true);
            }}
          />
        ))}
        {isOver && (
          <div className='border-primary/30 bg-primary/5 text-primary flex h-16 items-center justify-center rounded-xl border-2 border-dashed text-sm font-medium'>
            {BACKLOG_UI.DROP_TO_SPRINT}
          </div>
        )}
      </div>

      {/* Create task under sprint */}
      <div className='mt-4 flex items-center'>
        <button
          onClick={() => {
            setActiveSprintForTask(sprint.sprintId);
            setOpenCreateTask(true);
          }}
          className='bg-primary hover:bg-primary-hover active:bg-primary-700 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors'
        >
          <Plus className='h-4 w-4' />
          <span>{BACKLOG_UI.CREATE_TASK}</span>
        </button>
      </div>
    </div>
  );
}
