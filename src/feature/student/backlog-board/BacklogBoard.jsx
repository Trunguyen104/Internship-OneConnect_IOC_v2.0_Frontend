'use client';

import { Search, Filter } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { productBacklogService } from '@/services/productbacklog.service';

import CreateTaskModal from '@/shared/components/CreateTaskModal';
import UpdateTaskModal from '@/shared/components/UpdateTaskModal';
import CreateEpicModal from '@/feature/student/backlog-board/components/CreateEpicModal';
import StartSprintModal from '@/feature/student/backlog-board/components/StartSprintModal';
import CompleteSprintModal from '@/feature/student/backlog-board/components/CompleteSprintModal';

import { useBacklogBoard } from './hooks/useBacklogBoard';
import { EpicSidebar } from './components/EpicSidebar';
import { SprintSection } from './components/SprintSection';
import { BacklogSection } from './components/BacklogSection';

export default function BacklogBoard() {
  const toast = useToast();
  
  const {
    projectId,
    epics, setEpics,
    sprints, setSprints,
    backlogItems, setBacklogItems,
    loading,
    selectedEpicId, setSelectedEpicId,
    isSidebarOpen, setIsSidebarOpen,
    filteredBacklogItems,
    filteredSprints,
    itemOrders,
    activeSprintForTask, setActiveSprintForTask,
    
    openCreateEpic, setOpenCreateEpic,
    openCreateTask, setOpenCreateTask,
    openUpdateTask, setOpenUpdateTask,
    selectedTask, setSelectedTask,
    openStartSprint, setOpenStartSprint,
    openCompleteSprint, setOpenCompleteSprint,
    selectedSprintAction, setSelectedSprintAction,
    
    fetchData,
    handleDeleteSprint,
    handleSprintActionClick,
    handleQuickCreateSprint
  } = useBacklogBoard();

  const formatToDateOnly = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className='flex gap-6 w-full h-[calc(100vh-140px)] bg-slate-50 relative'>
      {/* Sidebar Epics */}
      <EpicSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        epics={epics}
        selectedEpicId={selectedEpicId}
        setSelectedEpicId={setSelectedEpicId}
        setOpenCreateEpic={setOpenCreateEpic}
      />

      {/* Main Board */}
      <div className='flex-1 flex flex-col min-w-0 overflow-y-auto pr-2 pb-10'>
        {/* Search / Filter Bar */}
        <div className='flex items-center gap-4 mb-6 sticky top-0 bg-slate-50 pt-1 z-10'>
          <div className='flex items-center w-[360px] h-10 px-4 rounded-full border border-gray-200 bg-white shadow-sm'>
            <Search className='w-4 h-4 text-gray-400 mr-2 shrink-0' />
            <input
              type='text'
              placeholder='Tìm kiếm'
              className='flex-1 outline-none text-sm bg-transparent placeholder-gray-400 text-gray-800'
            />
          </div>
          <button className='flex items-center gap-2 h-10 px-5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700'>
            <Filter className='w-4 h-4 text-gray-500' />
            Bộ lọc
          </button>
        </div>

        {loading ? (
          <div className='text-center py-10 text-slate-500'>Đang tải dữ liệu...</div>
        ) : (
          <div className='overflow-x-auto pb-4'>
            <div className='min-w-[1000px] pr-2'>
              {/* SPRINTS */}
              {filteredSprints.map((sprint) => (
                <SprintSection 
                  key={sprint.sprintId}
                  sprint={sprint}
                  projectId={projectId}
                  itemOrders={itemOrders}
                  handleSprintActionClick={handleSprintActionClick}
                  handleDeleteSprint={handleDeleteSprint}
                  setSelectedSprintAction={setSelectedSprintAction}
                  setSelectedTask={setSelectedTask}
                  setOpenUpdateTask={setOpenUpdateTask}
                  setActiveSprintForTask={setActiveSprintForTask}
                  setOpenCreateTask={setOpenCreateTask}
                />
              ))}

              {/* BACKLOG (Unassigned) */}
              <BacklogSection 
                filteredBacklogItems={filteredBacklogItems}
                projectId={projectId}
                itemOrders={itemOrders}
                handleQuickCreateSprint={handleQuickCreateSprint}
                setSelectedTask={setSelectedTask}
                setOpenUpdateTask={setOpenUpdateTask}
                setActiveSprintForTask={setActiveSprintForTask}
                setOpenCreateTask={setOpenCreateTask}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateEpicModal
        open={openCreateEpic}
        onClose={() => setOpenCreateEpic(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              title: payload.name,
              name: payload.name,
              description: payload.description,
              endDate: payload.endDate,
            };
            const res = await productBacklogService.createEpic(projectId, apiPayload);
            if (res && res.isSuccess === false) {
              toast.error('Lỗi khi tạo epic');
              return;
            }
            toast.success('Tạo Epic thành công');
            setOpenCreateEpic(false);
            if (res?.data) {
              setEpics((prev) => [...prev, res.data]);
            } else {
              fetchData(projectId);
            }
          } catch {
            toast.error('Lỗi mạng khi tạo Epic');
          }
        }}
      />

      <StartSprintModal
        open={openStartSprint}
        sprint={selectedSprintAction}
        issueCount={selectedSprintAction?.items?.length || 0}
        onClose={() => setOpenStartSprint(false)}
        onSubmit={async (payload) => {
          try {
            if (!selectedSprintAction) return;
            const startPayload = {
              startDate: formatToDateOnly(payload.startDate),
              endDate: formatToDateOnly(payload.endDate),
            };

            const resStart = await productBacklogService.startSprint(
              projectId,
              selectedSprintAction.sprintId,
              startPayload,
            );

            if (resStart && resStart.isSuccess !== false) {
              toast.success('Bắt đầu Sprint thành công');
              setSprints((prevSprints) =>
                prevSprints.map((s) =>
                  s.sprintId === selectedSprintAction.sprintId
                    ? { ...s, status: 'ACTIVE' }
                    : s,
                ),
              );
              setOpenStartSprint(false);
              fetchData(projectId);
            }
          } catch {
            toast.error('Lỗi khi bắt đầu Sprint');
          }
        }}
      />

      <CompleteSprintModal
        open={openCompleteSprint}
        sprint={selectedSprintAction}
        sprints={sprints}
        onClose={() => setOpenCompleteSprint(false)}
        onSubmit={async (payload) => {
          try {
            if (!selectedSprintAction) return;

            const completePayload = {
              incompleteItemsOption: payload.incompleteItemsOption,
              targetSprintId: payload.targetSprintId,
              newSprintName: payload.newSprintName || '',
            };

            const resComp = await productBacklogService.completeSprint(
              projectId,
              selectedSprintAction.sprintId,
              completePayload,
            );

            if (resComp && resComp.isSuccess === false) {
              return toast.error(resComp.message || 'Lỗi khi hoàn thành Sprint');
            }

            toast.success('Hoàn thành Sprint thành công');
            setOpenCompleteSprint(false);

            if (payload.incompleteItemsOption === 'ToBacklog') {
              const undoneItems = selectedSprintAction.items.filter((it) => {
                const status = (it.status?.name || it.status || '').toUpperCase();
                return !['DONE', 'COMPLETED', 'CLOSED'].includes(status);
              });

              setBacklogItems((prev) => [...prev, ...undoneItems]);
            }

            setSprints((prev) => prev.filter((s) => s.sprintId !== selectedSprintAction.sprintId));

            setTimeout(() => {
              fetchData(projectId, false);
            }, 500);
          } catch (err) {
            console.error('COMPLETE ERROR:', err);
            toast.error('Lỗi server khi hoàn thành Sprint');
          }
        }}
      />
      
      <CreateTaskModal
        open={openCreateTask}
        epics={epics}
        sprints={sprints}
        initialSprintId={activeSprintForTask}
        onClose={() => {
          setOpenCreateTask(false);
          setActiveSprintForTask(null);
        }}
        onSubmit={async (payload) => {
          try {
            const targetSprintId = payload.sprintId || activeSprintForTask;

            const apiPayload = {
              title: payload.summary,
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: payload.dueDate,
              storyPoint: payload.points || 0,
              sprintId: targetSprintId || null,
            };

            const resCreate = await productBacklogService.createWorkItem(projectId, apiPayload);

            if (!resCreate || resCreate.isSuccess === false) {
              throw new Error('Create failed');
            }

            const newWorkItemId =
              typeof resCreate.data === 'string'
                ? resCreate.data
                : resCreate.data.workItemId || resCreate.data.id;

            const epicName = epics.find((e) => e.id === payload.epic)?.title || '';

            const optimisticItem = {
              ...apiPayload,
              workItemId: newWorkItemId,
              id: newWorkItemId,
              epicName,
              sprintId: targetSprintId || null,
            };

            if (targetSprintId) {
              setSprints((prev) =>
                prev.map((s) =>
                  s.sprintId === targetSprintId
                    ? {
                      ...s,
                      items: [...(s.items || []), optimisticItem],
                      itemCount: (s.itemCount || 0) + 1,
                    }
                    : s,
                ),
              );
            } else {
              setBacklogItems((prev) => [...prev, optimisticItem]);
            }

            toast.success(
              targetSprintId ? 'Tạo và găm vào Sprint thành công!' : 'Tạo nhiệm vụ thành công!',
            );

            setOpenCreateTask(false);
            setActiveSprintForTask(null);

            setTimeout(() => {
              fetchData(projectId, false);
            }, 800);
          } catch (error) {
            console.error('ANTIGRAVITY ERROR:', error);
            toast.error('Lỗi khi tạo nhiệm vụ');
          }
        }}
      />

      <UpdateTaskModal
        open={openUpdateTask}
        epics={epics}
        sprints={sprints}
        initialData={selectedTask}
        onClose={() => {
          setOpenUpdateTask(false);
          setSelectedTask(null);
        }}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              title: payload.summary,
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: payload.dueDate,
              storyPoint: payload.points || 0,
            };

            const currentSprintId = selectedTask?.sprintId;
            const newSprintId = payload.sprintId;
            const workItemId = payload.id;

            const resUpdate = await productBacklogService.updateWorkItem(
              projectId,
              workItemId,
              apiPayload,
            );
            if (!resUpdate || resUpdate.isSuccess === false) {
              throw new Error('Update failed');
            }

            if (currentSprintId !== newSprintId) {
              if (!newSprintId) {
                await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
              } else {
                await productBacklogService.moveWorkItemToSprint(
                  projectId,
                  workItemId,
                  newSprintId,
                );
              }
            }

            toast.success('Cập nhật nhiệm vụ thành công!');
            setOpenUpdateTask(false);
            setSelectedTask(null);

            fetchData(projectId, false);
          } catch (error) {
            console.error('UPDATE ERROR:', error);
            toast.error('Lỗi khi cập nhật nhiệm vụ');
          }
        }}
      />
    </div>
  );
}
