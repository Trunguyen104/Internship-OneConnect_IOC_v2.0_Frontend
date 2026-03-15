import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

import { useBacklogBoard } from '../hooks/useBacklogBoard';
import { EpicSidebar } from './EpicSidebar';
import { SprintSection } from './SprintSection';
import { BacklogSection } from './BacklogSection';
import { BoardHeader } from './BoardHeader';
import { BacklogModals } from './BacklogModals';
import { BACKLOG_UI } from '@/constants/backlog';

export default function BacklogBoard() {
  const {
    projectId,
    epics,
    setEpics,
    sprints,
    setSprints,
    setBacklogItems,
    loading,
    selectedEpicId,
    setSelectedEpicId,
    searchText,
    setSearchText,
    isSidebarOpen,
    setIsSidebarOpen,
    filteredBacklogItems,
    filteredSprints,
    itemOrders,
    activeSprintForTask,
    setActiveSprintForTask,

    openCreateEpic,
    setOpenCreateEpic,
    openUpdateEpic,
    setOpenUpdateEpic,
    selectedEpic,
    setSelectedEpic,
    openCreateTask,
    setOpenCreateTask,
    openUpdateTask,
    setOpenUpdateTask,
    selectedTask,
    setSelectedTask,
    openStartSprint,
    setOpenStartSprint,
    openCompleteSprint,
    setOpenCompleteSprint,
    selectedSprintAction,
    setSelectedSprintAction,

    handleQuickCreateSprint,
    handleDeleteSprint,
    handleDeleteEpic,
    handleDeleteWorkItem,
    handleSprintActionClick,
    fetchData,
    openCreateSprint,
    setOpenCreateSprint,
    openUpdateSprint,
    setOpenUpdateSprint,
    handleDragEnd,
  } = useBacklogBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  return (
    <div className='bg-bg relative flex h-[calc(100vh-140px)] w-full gap-6'>
      {/* Sidebar Epics */}
      <EpicSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        epics={epics}
        selectedEpicId={selectedEpicId}
        setSelectedEpicId={setSelectedEpicId}
        setOpenCreateEpic={setOpenCreateEpic}
        setOpenUpdateEpic={setOpenUpdateEpic}
        setSelectedEpic={setSelectedEpic}
        handleDeleteEpic={handleDeleteEpic}
      />

      {/* Main Board */}
      <div className='flex min-w-0 flex-1 flex-col overflow-y-auto pr-2 pb-10'>
        <BoardHeader searchText={searchText} setSearchText={setSearchText} />

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {loading ? (
            <div className='text-muted py-10 text-center'>{BACKLOG_UI.LOADING}</div>
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
                    setOpenUpdateSprint={setOpenUpdateSprint}
                    setActiveSprintForTask={setActiveSprintForTask}
                    setOpenCreateTask={setOpenCreateTask}
                    handleDeleteWorkItem={handleDeleteWorkItem}
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
                  handleDeleteWorkItem={handleDeleteWorkItem}
                />
              </div>
            </div>
          )}
        </DndContext>
      </div>

      <BacklogModals
        projectId={projectId}
        epics={epics}
        setEpics={setEpics}
        sprints={sprints}
        setSprints={setSprints}
        setBacklogItems={setBacklogItems}
        fetchData={fetchData}
        openCreateEpic={openCreateEpic}
        setOpenCreateEpic={setOpenCreateEpic}
        openUpdateEpic={openUpdateEpic}
        setOpenUpdateEpic={setOpenUpdateEpic}
        openStartSprint={openStartSprint}
        setOpenStartSprint={setOpenStartSprint}
        openCompleteSprint={openCompleteSprint}
        setOpenCompleteSprint={setOpenCompleteSprint}
        openCreateTask={openCreateTask}
        setOpenCreateTask={setOpenCreateTask}
        openUpdateTask={openUpdateTask}
        setOpenUpdateTask={setOpenUpdateTask}
        openCreateSprint={openCreateSprint}
        setOpenCreateSprint={setOpenCreateSprint}
        openUpdateSprint={openUpdateSprint}
        setOpenUpdateSprint={setOpenUpdateSprint}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        selectedEpic={selectedEpic}
        setSelectedEpic={setSelectedEpic}
        selectedSprintAction={selectedSprintAction}
        activeSprintForTask={activeSprintForTask}
        setActiveSprintForTask={setActiveSprintForTask}
      />
    </div>
  );
}
