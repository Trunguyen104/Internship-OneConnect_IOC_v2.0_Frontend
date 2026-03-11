import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { WorkItem, ColumnHeaders } from './WorkItem';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';

export function BacklogSection({
  filteredBacklogItems,
  projectId,
  itemOrders,
  handleQuickCreateSprint,
  setSelectedTask,
  setOpenUpdateTask,
  setActiveSprintForTask,
  setOpenCreateTask
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'BACKLOG',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`rounded-3xl bg-white border shadow-sm p-6 mt-8 transition-colors ${
        isOver ? 'bg-blue-50/50 border-primary border-dashed' : 'border-gray-100'
      }`}
    >
      <div className='flex items-center mb-6 pl-2 pr-1'>
        <div className='w-4 h-4 rounded border border-gray-300 mr-4 flex-shrink-0' />
        <h3 className='text-[16px] font-bold text-gray-900'>Backlog</h3>
        <div className='flex-1' />
        <div className='flex items-center gap-3'>
          <button
            onClick={handleQuickCreateSprint}
            className='h-[34px] px-5 border border-gray-200 bg-white rounded-full text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm'
          >
            Tạo Sprint
          </button>
        </div>
      </div>

      <ColumnHeaders />
      <div className='min-h-[50px] mb-4'>
        {filteredBacklogItems.map((it) => (
          <WorkItem
            key={it.workItemId || it.id}
            it={it}
            itemOrder={itemOrders[it.workItemId || it.id]}
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
          <div className='h-16 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex items-center justify-center text-primary text-sm font-medium'>
            Thả vào đây để đưa về Backlog
          </div>
        )}
      </div>

      <div className='flex items-center gap-6 mt-4 pl-2'>
        <button
          onClick={() => {
            setActiveSprintForTask(null); // Backlog implies null sprint
            setOpenCreateTask(true);
          }}
          className='flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium
bg-primary text-white hover:bg-primary-hover active:bg-primary-700'
        >
          <Plus className='w-4 h-4' />
          Tạo nhiệm vụ
        </button>
      </div>
    </div>
  );
}

