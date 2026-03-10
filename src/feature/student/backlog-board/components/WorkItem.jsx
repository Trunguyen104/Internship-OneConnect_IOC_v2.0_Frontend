import { MoreVertical } from 'lucide-react';

const statusToneText = {
  TODO: 'text-gray-500',
  IN_PROGRESS: 'text-blue-500',
  IN_REVIEW: 'text-amber-500',
  DONE: 'text-green-500',
};

const stringToColorTuple = (str) => {
  let hash = 0;
  for (let i = 0; i < (str?.length || 0); i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 70%, 90%)`, text: `hsl(${hue}, 70%, 30%)` };
};

export function WorkItem({ it, itemOrder, onClick }) {
  const statusConfig = statusToneText[it.status?.toUpperCase()] || statusToneText.TODO;

  return (
    <div
      onClick={() => onClick?.(it)}
      className='flex items-center justify-between py-3 mb-2 bg-white group hover:bg-gray-50/50 rounded-xl border-b border-transparent hover:border-gray-100 transition-colors cursor-pointer'
    >
      <div className='w-4 h-4 rounded border border-gray-300 mr-4 shrink-0' />

      <div className='w-32 shrink-0 text-[13px] text-gray-900 font-medium whitespace-nowrap pl-1 tracking-wide'>
        Issue {itemOrder || '-'}
      </div>

      <div
        className='flex-1 min-w-0 text-[13.5px] text-gray-900 font-medium truncate pr-4'
        title={it.title || it.name}
      >
        {it.title || it.name}
      </div>

      <div className={`w-28 shrink-0 text-[13px] font-medium ${statusConfig}`}>
        {it.status === 'IN_PROGRESS'
          ? 'In Progress'
          : it.status === 'IN_REVIEW'
            ? 'In Review'
            : it.status === 'TODO'
              ? 'To Do'
              : it.status || 'To Do'}
      </div>

      <div className='w-44 shrink-0 px-2 flex justify-start'>
        {it.epicName ? (
          <span className='px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 truncate w-full text-center'>
            {it.epicName}
          </span>
        ) : (
          <span className='w-full'></span>
        )}
      </div>

      <div className='w-24 shrink-0 text-[13px] text-gray-500 text-center font-medium'>
        {it.dueDate ? new Date(it.dueDate).toLocaleDateString('vi-VN') : '-'}
      </div>

      <div className='w-10 shrink-0 text-[13px] text-blue-600 font-bold text-center'>
        {it.storyPoint || it.points || '-'}
      </div>

      <div
        className={`w-24 shrink-0 text-[13px] font-medium text-center ${it.priority?.toUpperCase() === 'HIGH' ? 'text-orange-500' : it.priority?.toUpperCase() === 'LOW' ? 'text-green-600' : 'text-blue-500'}`}
      >
        {it.priority === 'HIGH' ? 'High' : it.priority === 'LOW' ? 'Low' : 'Medium'}
      </div>

      <div className='w-12 shrink-0 flex justify-center'>
        <div
          className='h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold'
          style={{
            backgroundColor: stringToColorTuple(it.assigneeName || 'U').bg,
            color: stringToColorTuple(it.assigneeName || 'U').text,
          }}
        >
          {(it.assigneeName || '?').charAt(0).toUpperCase()}
        </div>
      </div>

      <div className='w-8 shrink-0 flex justify-center text-gray-400 opacity-50 hover:opacity-100 transition-opacity'>
        <MoreVertical className='w-4 h-4' />
      </div>
    </div>
  );
}

export function ColumnHeaders() {
  return (
    <div className='flex items-center justify-between py-2 mb-2 bg-gray-50/80 rounded-lg px-2 border-b border-gray-100/50'>
      <div className='w-4 mr-4 shrink-0' />
      <div className='w-32 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1'>
        Issue
      </div>
      <div className='flex-1 min-w-0 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
        Summary
      </div>
      <div className='w-28 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
        Status
      </div>
      <div className='w-44 shrink-0 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Epic
      </div>
      <div className='w-24 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Due Date
      </div>
      <div className='w-10 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Pts
      </div>
      <div className='w-24 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        Priority
      </div>
      <div className='w-12 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>
        User
      </div>
      <div className='w-8 shrink-0' />
    </div>
  );
}
