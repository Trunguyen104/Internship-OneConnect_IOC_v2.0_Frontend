import { Search, Filter } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { productBacklogService } from '@/services/productbacklog.service';

import CreateTaskModal from '@/shared/components/CreateTaskModal';
import UpdateTaskModal from '@/shared/components/UpdateTaskModal';
import CreateEpicModal from '@/feature/student/backlog-board/components/CreateEpicModal';
import StartSprintModal from '@/feature/student/backlog-board/components/StartSprintModal';
import CompleteSprintModal from '@/feature/student/backlog-board/components/CompleteSprintModal';
import CreateSprintModal from '@/feature/student/backlog-board/components/CreateSprintModal';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { useBacklogBoard } from './hooks/useBacklogBoard';
import { EpicSidebar } from './components/EpicSidebar';
import { SprintSection } from './components/SprintSection';
import { BacklogSection } from './components/BacklogSection';

import { SPRINT_STATUS, WORK_ITEM_STATUS, MOVE_INCOMPLETE_ITEMS_OPTION } from '@/constants/enums';

export default function BacklogBoard() {
  const toast = useToast();

  const {
    projectId,
    epics, setEpics,
    sprints, setSprints,
    setBacklogItems,
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

    handleQuickCreateSprint,
    handleDeleteSprint,
    handleSprintActionClick,
    fetchData,
    openCreateSprint, setOpenCreateSprint,
    handleDragEnd,
  } = useBacklogBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

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

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
        </DndContext>
      </div>

      {/* Modals */}
      <CreateEpicModal
        open={openCreateEpic}
        onClose={() => setOpenCreateEpic(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              projectId,
              name: payload.name,
              title: payload.name, // Cover both Name and Title common patterns
              nane: payload.name,  // Cover suspicious typo from Swagger screenshot
              description: payload.description,
              endDate: payload.endDate,
            };
            const res = await productBacklogService.createEpic(projectId, apiPayload);
            if (res && res.isSuccess === false) {
              toast.error(res.message || 'Lỗi khi tạo epic');
              return;
            }
            toast.success('Tạo Epic thành công');
            setOpenCreateEpic(false);

            if (res?.data) {
              // Normalize the new epic immediately so sidebar works
              const newEpic = {
                ...res.data,
                id: res.data.id || res.data.workItemId,
                title: res.data.title || res.data.name || payload.name,
              };
              setEpics((prev) => [...prev, newEpic]);
            } else {
              fetchData(projectId);
            }
          } catch (error) {
            console.error('CREATE EPIC ERROR:', error);
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

            const targetId = selectedSprintAction.sprintId || selectedSprintAction.id;

            const startPayload = {
              projectId,
              name: payload.name,
              goal: payload.goal,
              startDate: formatToDateOnly(payload.startDate),
              endDate: formatToDateOnly(payload.endDate),
            };

            const resStart = await productBacklogService.startSprint(
              projectId,
              targetId,
              startPayload,
            );

            if (resStart && resStart.isSuccess !== false) {
              toast.success('Bắt đầu Sprint thành công');
              setSprints((prevSprints) =>
                prevSprints.map((s) =>
                  s.sprintId === selectedSprintAction.sprintId
                    ? { ...s, status: SPRINT_STATUS.ACTIVE }
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
              projectId,
              incompleteItemsOption: payload.incompleteItemsOption,
              targetSprintId: payload.targetSprintId,
              newSprintName: payload.newSprintName || '',
            };

            const resComp = await productBacklogService.completeSprint(
              projectId,
              selectedSprintAction.sprintId || selectedSprintAction.id,
              completePayload,
            );

            if (resComp && resComp.isSuccess === false) {
              return toast.error(resComp.message || 'Lỗi khi hoàn thành Sprint');
            }

            toast.success('Hoàn thành Sprint thành công');
            setOpenCompleteSprint(false);

            if (payload.incompleteItemsOption === MOVE_INCOMPLETE_ITEMS_OPTION.TO_BACKLOG) {
              const undoneItems = selectedSprintAction.items.filter((it) => {
                const status = it.status?.name || it.status;
                return status !== WORK_ITEM_STATUS.DONE && status !== 'DONE';
              });

              setBacklogItems((prev) => [...prev, ...undoneItems]);
            }

            setSprints((prev) => prev.filter((s) => (s.sprintId || s.id) !== (selectedSprintAction.sprintId || selectedSprintAction.id)));

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
              projectId,
              title: payload.summary,
              name: payload.summary, // Redundant field for compatibility
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: formatToDateOnly(payload.dueDate),
              storyPoint: payload.points,
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
              projectId,
              title: payload.summary,
              name: payload.summary, // Redundancy
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: formatToDateOnly(payload.dueDate),
              storyPoint: payload.points,
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

      <CreateSprintModal
        open={openCreateSprint}
        projectId={projectId}
        onClose={() => setOpenCreateSprint(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              projectId,
              ...payload,
            };
            const res = await productBacklogService.createSprint(projectId, apiPayload);
            if (res && res.isSuccess === false) {
              toast.error(res.message || 'Lỗi khi tạo Sprint');
              return;
            }

            toast.success('Tạo Sprint thành công!');
            setOpenCreateSprint(false);
            fetchData(projectId, false);
          } catch (err) {
            console.error('CREATE SPRINT ERROR:', err);
            toast.error('Lỗi server khi tạo Sprint');
          }
        }}
      />
    </div>
  );
}
