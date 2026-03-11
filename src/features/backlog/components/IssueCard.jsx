import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WORK_ITEM_PRIORITY, PRIORITY_MAP, TYPE_MAP } from '@/constants/enums';

export function IssueCard({ task, isOverlay }) {
  const getPriorityStyle = (priority) => {
    // Chấp nhận cả string (cũ) và number (mới)
    const val = typeof priority === 'string' ? WORK_ITEM_PRIORITY[priority.toUpperCase()] : priority;

    if (val === WORK_ITEM_PRIORITY.HIGH || val === WORK_ITEM_PRIORITY.CRITICAL) return 'bg-orange-50 text-orange-700';
    if (val === WORK_ITEM_PRIORITY.LOW) return 'bg-green-50 text-green-700';
    return 'bg-blue-50 text-blue-700';
  };

  return (
    <div
      className={`bg-white border p-4 rounded-[24px] shadow-sm flex flex-col gap-3 transition-all relative ${
        isOverlay
          ? 'cursor-grabbing border-blue-500 shadow-xl scale-105'
          : 'cursor-grab border-gray-100 hover:shadow-md hover:border-gray-200'
      }`}
    >
      <div className='flex justify-between items-start'>
        <div className='px-3 py-1 border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 bg-white uppercase'>
          {TYPE_MAP[task.type] || task.type || 'User Story'}
        </div>
      </div>
      <div className='mt-0.5'>
        <div className='text-[18px] font-extrabold text-gray-900 leading-none mb-2'>
          {task.displayId}
        </div>
        <div
          className='text-[14px] font-medium text-gray-600 line-clamp-3 leading-snug'
          dangerouslySetInnerHTML={{ __html: task.title }}
        />
      </div>
      <div className='flex flex-wrap gap-2 items-center mt-1'>
        <span
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getPriorityStyle(task.priority)}`}
        >
          {PRIORITY_MAP[task.priority] || task.priority}
        </span>
        {task.points > 0 && (
          <span className='w-6 h-6 flex items-center justify-center text-[11px] font-bold bg-blue-50 text-blue-500 rounded-full border border-blue-100'>
            {task.points}
          </span>
        )}
      </div>
      <div className='flex items-center mt-1'>
        <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 text-[10px] font-bold uppercase'>
          {task.assignee?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export function SortableIssueCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className='touch-none' onClick={() => onClick(task)}>
      <div {...attributes} {...listeners}>
        <IssueCard task={task} />
      </div>
    </div>
  );
}

