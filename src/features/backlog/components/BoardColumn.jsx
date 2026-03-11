import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableIssueCard } from './IssueCard';

export function BoardColumn({ column, tasks, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-sm font-bold text-gray-700'>{column.title}</span>
        <span className='text-[11px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full'>
          {tasks.length}
        </span>
      </div>
      <div className={`h-1 w-full ${column.underline} mb-4 rounded-full opacity-80`} />
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-4 p-1 min-h-[calc(100vh-300px)] transition-colors rounded-xl ${
          isOver ? 'bg-gray-50/50' : 'bg-transparent'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <SortableIssueCard key={t.id} task={t} onClick={onCardClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

