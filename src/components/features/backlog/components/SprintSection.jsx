import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { MoreVertical, Plus, Pencil, Trash2 } from 'lucide-react';
import { WorkItem, ColumnHeaders } from './WorkItem';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { SPRINT_STATUS } from '@/constants/enums';

export function SprintSection({
  sprint,
  projectId,
  itemOrders,
  handleSprintActionClick,
  handleDeleteSprint,
  setSelectedSprintAction,
  setSelectedTask,
  setOpenUpdateTask,
  setActiveSprintForTask,
  setOpenCreateTask
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
      className={`rounded-3xl bg-white border shadow-sm p-6 mb-6 transition-colors ${
        isOver ? 'bg-blue-50/50 border-primary border-dashed' : 'border-gray-100'
      }`}
    >
      {/* Header */}
      <div className='flex items-center mb-6 pl-2 pr-1'>
        <div className='w-4 h-4 rounded border border-gray-300 mr-4 flex-shrink-0' />
        <h3 className='text-[16px] font-bold text-gray-900'>
          {sprint.name || sprint.title}
        </h3>
        <div className='flex-1' />

        {/* Dynamic Start/Complete Sprint button based on status */}
        {sprint.status === SPRINT_STATUS.ACTIVE ? (
          <button
            onClick={() => handleSprintActionClick(sprint, false)}
            className='h-[34px] px-5 border border-green-200 bg-green-50 rounded-full text-[13px] font-medium text-green-700 hover:bg-green-100 transition-colors flex items-center shadow-sm'
          >
            Hoàn thành Sprint
          </button>
        ) : (
          <button
            onClick={() => handleSprintActionClick(sprint, true)}
            className='h-[34px] px-5 border border-gray-200 bg-white rounded-full text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center shadow-sm'
          >
            Bắt đầu Sprint
          </button>
        )}

        {/* Custom Dropdown Menu */}
        <div className='relative' ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`ml-3 p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-all outline-none ${isMenuOpen ? 'ring-2 ring-primary bg-gray-50' : ''
              }`}
          >
            <MoreVertical className='w-4 h-4' />
          </button>

          {isMenuOpen && (
            <div className='absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border border-gray-100 bg-white p-1 z-50 animate-in fade-in zoom-in duration-200'>
              <button
                onClick={() => {
                  setSelectedSprintAction(sprint);
                  console.log('Mở modal sửa cho sprint:', sprint.sprintId);
                  setIsMenuOpen(false);
                }}
                className='flex items-center gap-3 w-full px-4 py-3 cursor-pointer rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left'
              >
                <Pencil className='w-4 h-4 text-blue-600' />
                Chỉnh sửa Sprint
              </button>

              <button
                onClick={() => {
                  handleDeleteSprint(sprint.sprintId);
                  setIsMenuOpen(false);
                }}
                className='flex items-center gap-3 w-full px-4 py-3 cursor-pointer rounded-xl font-semibold text-danger hover:bg-red-50 transition-colors text-left'
              >
                <Trash2 className='w-4 h-4 text-danger' />
                Xóa Sprint
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
            Thả vào đây để chuyển vào Sprint
          </div>
        )}
      </div>

      {/* TẠO NHIỆM VỤ DƯỚI SPRINT */}
      <div className='mt-4 flex items-center'>
        <button
          onClick={() => {
            setActiveSprintForTask(sprint.sprintId);
            setOpenCreateTask(true);
          }}
          className='flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium
bg-primary text-white hover:bg-primary-hover active:bg-primary-700'
        >
          <Plus className='w-4 h-4' />
          <span>Tạo nhiệm vụ</span>
        </button>
      </div>
    </div>
  );
}

