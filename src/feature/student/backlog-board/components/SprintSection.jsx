import { MoreVertical, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { WorkItem, ColumnHeaders } from './WorkItem';
import { productBacklogService } from '@/services/productbacklog.service';

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
  return (
    <div className='rounded-3xl bg-white border border-gray-100 shadow-sm p-6 mb-6'>
      {/* Header */}
      <div className='flex items-center mb-6 pl-2 pr-1'>
        <div className='w-4 h-4 rounded border border-gray-300 mr-4 flex-shrink-0' />
        <h3 className='text-[16px] font-bold text-gray-900'>
          {sprint.name || sprint.title}
        </h3>
        <div className='flex-1' />

        {/* Dynamic Start/Complete Sprint button based on status */}
        {sprint.status?.toUpperCase() === 'ACTIVE' ||
          sprint.status?.toUpperCase() === 'IN_PROGRESS' ? (
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className='ml-3 p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-all outline-none 
data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:bg-gray-50'
            >
              <MoreVertical className='w-4 h-4' />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align='end'
            className='w-52 rounded-2xl shadow-xl border-gray-100 p-1'
          >
            <DropdownMenuItem
              onClick={() => {
                setSelectedSprintAction(sprint);
                console.log('Mở modal sửa cho sprint:', sprint.sprintId);
              }}
              className='flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl font-semibold text-gray-700 focus:bg-gray-50 transition-colors'
            >
              <Pencil className='w-4 h-4 text-blue-600' />
              Chỉnh sửa Sprint
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleDeleteSprint(sprint.sprintId)}
              className='flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl font-semibold text-danger focus:text-danger focus:bg-red-50 transition-colors'
            >
              <Trash2 className='w-4 h-4 text-danger' />
              Xóa Sprint
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
