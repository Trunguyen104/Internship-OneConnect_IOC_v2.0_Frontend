import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';

import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

import { ColumnHeaders, WorkItem } from './WorkItem';

export function BacklogSection({
  filteredBacklogItems,
  projectId,
  itemOrders,
  handleQuickCreateSprint,
  handleDeleteWorkItem,
  setSelectedTask,
  setOpenUpdateTask,
  setActiveSprintForTask,
  setOpenCreateTask,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'BACKLOG',
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-8 rounded-3xl border bg-white p-6 shadow-sm transition-colors ${
        isOver ? 'border-primary border-dashed bg-blue-50/50' : 'border-gray-100'
      }`}
    >
      <div className="mb-6 flex items-center pr-1 pl-2">
        <div className="mr-4 h-4 w-4 flex-shrink-0 rounded border border-gray-300" />
        <h3 className="text-[16px] font-bold text-gray-900">{BACKLOG_UI.BACKLOG_TITLE}</h3>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <button
            onClick={handleQuickCreateSprint}
            className="h-[34px] rounded-full border border-gray-200 bg-white px-5 text-[13px] font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            {BACKLOG_UI.CREATE_SPRINT}
          </button>
        </div>
      </div>

      <ColumnHeaders />
      <div className="mb-4 min-h-[50px]">
        {filteredBacklogItems.map((it) => (
          <WorkItem
            key={it.workItemId || it.id}
            it={it}
            itemOrder={itemOrders[it.workItemId || it.id]}
            onDelete={() => handleDeleteWorkItem?.(it.workItemId || it.id)}
            onClick={async (task) => {
              try {
                const res = await productBacklogService.getWorkItemById(
                  projectId,
                  task.workItemId || task.id
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
          <div className="border-primary/30 bg-primary/5 text-primary flex h-16 items-center justify-center rounded-xl border-2 border-dashed text-sm font-medium">
            {BACKLOG_UI.DROP_TO_BACKLOG}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-6 pl-2">
        <button
          onClick={() => {
            setActiveSprintForTask(null); // Backlog implies null sprint
            setOpenCreateTask(true);
          }}
          className="bg-primary hover:bg-primary-hover active:bg-primary-700 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          {BACKLOG_UI.CREATE_TASK}
        </button>
      </div>
    </div>
  );
}
