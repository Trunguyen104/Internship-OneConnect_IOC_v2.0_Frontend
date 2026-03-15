import React from 'react';
import { useBacklogActions } from '@/components/features/backlog/hooks/useBacklogActions';

import CreateTaskModal from '@/components/features/backlog/components/CreateTaskModal';
import UpdateTaskModal from '@/components/features/backlog/components/UpdateTaskModal';
import CreateEpicModal from '@/components/features/backlog/components/CreateEpicModal';
import StartSprintModal from '@/components/features/backlog/components/StartSprintModal';
import CompleteSprintModal from '@/components/features/backlog/components/CompleteSprintModal';
import CreateSprintModal from '@/components/features/backlog/components/CreateSprintModal';

export const BacklogModals = ({
  projectId,
  epics,
  setEpics,
  sprints,
  setSprints,
  setBacklogItems,
  fetchData,
  openCreateEpic,
  setOpenCreateEpic,
  openStartSprint,
  setOpenStartSprint,
  openCompleteSprint,
  setOpenCompleteSprint,
  openCreateTask,
  setOpenCreateTask,
  openUpdateTask,
  setOpenUpdateTask,
  openCreateSprint,
  setOpenCreateSprint,
  selectedTask,
  setSelectedTask,
  selectedSprintAction,
  activeSprintForTask,
  setActiveSprintForTask,
}) => {
  const actions = useBacklogActions({
    projectId,
    epics,
    setEpics,
    sprints,
    setSprints,
    setBacklogItems,
    fetchData,
    ui: {
      setOpenCreateEpic,
      setOpenStartSprint,
      setOpenCompleteSprint,
      setOpenCreateTask,
      setOpenUpdateTask,
      setOpenCreateSprint,
      setSelectedTask,
      setActiveSprintForTask,
    },
  });

  return (
    <>
      <CreateEpicModal
        open={openCreateEpic}
        onClose={() => setOpenCreateEpic(false)}
        onSubmit={actions.handleCreateEpic}
      />

      <StartSprintModal
        open={openStartSprint}
        sprint={selectedSprintAction}
        issueCount={selectedSprintAction?.items?.length || 0}
        onClose={() => setOpenStartSprint(false)}
        onSubmit={(payload) => actions.handleStartSprint(selectedSprintAction, payload)}
      />

      <CompleteSprintModal
        open={openCompleteSprint}
        sprint={selectedSprintAction}
        sprints={sprints}
        onClose={() => setOpenCompleteSprint(false)}
        onSubmit={(payload) => actions.handleCompleteSprint(selectedSprintAction, payload)}
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
        onSubmit={(payload) => actions.handleCreateTask(payload, activeSprintForTask)}
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
        onSubmit={(payload) => actions.handleUpdateTask(selectedTask, payload)}
      />

      <CreateSprintModal
        open={openCreateSprint}
        projectId={projectId}
        onClose={() => setOpenCreateSprint(false)}
        onSubmit={actions.handleCreateSprint}
      />
    </>
  );
};
