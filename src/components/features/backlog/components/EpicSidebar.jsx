import { Plus } from 'lucide-react';

export function EpicSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  epics,
  selectedEpicId,
  setSelectedEpicId,
  setOpenCreateEpic
}) {
  if (!isSidebarOpen) {
    return (
      <div className='w-12 shrink-0 bg-white border border-gray-200 shadow-sm rounded-3xl flex flex-col items-center py-6 h-full transition-all duration-300'>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 w-full h-full'
        >
          <span
            className='uppercase tracking-[0.3em] text-sm font-bold'
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            EPIC
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className='w-[260px] shrink-0 bg-white border border-gray-200 shadow-sm rounded-3xl p-5 flex flex-col h-full overflow-y-auto transition-all duration-300'>
      <div className='flex justify-between items-center mb-6'>
        <div className='text-[15px] font-bold text-gray-900'>Epic</div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='text-xs text-[#A32A2A] font-bold hover:underline'
          >
            Ẩn
          </button>
          <button
            onClick={() => setOpenCreateEpic(true)}
            className='w-[22px] h-[22px] rounded-full bg-[#A32A2A] text-white flex items-center justify-center hover:bg-red-800 transition-colors'
            title='Tạo Epic'
          >
            <Plus className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <button
          onClick={() => setSelectedEpicId('ALL')}
          className={`text-left px-4 py-2.5 rounded-2xl text-[14px] font-semibold transition-colors ${
            selectedEpicId === 'ALL'
              ? 'bg-[#F4F0FF] text-[#6333FF]'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Tất cả
        </button>

        {epics.map((epic) => (
          <button
            key={epic.id}
            onClick={() => setSelectedEpicId(epic.id)}
            className={`text-left px-4 py-2.5 rounded-2xl text-[14px] font-semibold transition-colors ${
              selectedEpicId === epic.id
                ? 'bg-[#F4F0FF] text-[#6333FF]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className='truncate'>{epic.title || epic.name || 'Untitled Epic'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

