import React from 'react';

import CompleteSprintModal from '@/components/features/backlog/components/CompleteSprintModal';
import CreateEpicModal from '@/components/features/backlog/components/CreateEpicModal';
import CreateSprintModal from '@/components/features/backlog/components/CreateSprintModal';
import CreateTaskModal from '@/components/features/backlog/components/CreateTaskModal';
import StartSprintModal from '@/components/features/backlog/components/StartSprintModal';
import UpdateEpicModal from '@/components/features/backlog/components/UpdateEpicModal';
import UpdateSprintModal from '@/components/features/backlog/components/UpdateSprintModal';
import UpdateTaskModal from '@/components/features/backlog/components/UpdateTaskModal';
import { useBacklogActions } from '@/components/features/backlog/hooks/useBacklogActions';

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
  openUpdateEpic,
  setOpenUpdateEpic,
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
  openUpdateSprint,
  setOpenUpdateSprint,
  selectedTask,
  setSelectedTask,
  selectedEpic,
  setSelectedEpic,
  selectedSprintAction,
  activeSprintForTask,
  setActiveSprintForTask,
  members = [],
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
      setOpenUpdateEpic,
      setOpenStartSprint,
      setOpenCompleteSprint,
      setOpenCreateTask,
      setOpenUpdateTask,
      setOpenCreateSprint,
      setOpenUpdateSprint,
      setSelectedTask,
      setSelectedEpic,
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

      {openUpdateEpic ? (
        <UpdateEpicModal
          open={openUpdateEpic}
          initialData={selectedEpic}
          onClose={() => {
            setOpenUpdateEpic(false);
            setSelectedEpic(null);
          }}
          onSubmit={(payload) => actions.handleUpdateEpic(selectedEpic?.id, payload)}
          onDelete={() => actions.handleDeleteEpic(selectedEpic?.id)}
        />
      ) : null}

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
        members={members}
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
        members={members}
      />

      <CreateSprintModal
        open={openCreateSprint}
        projectId={projectId}
        onClose={() => setOpenCreateSprint(false)}
        onSubmit={actions.handleCreateSprint}
      />

      {openUpdateSprint ? (
        <UpdateSprintModal
          open={openUpdateSprint}
          sprint={selectedSprintAction}
          onClose={() => setOpenUpdateSprint(false)}
          onSubmit={(payload) =>
            actions.handleUpdateSprint(selectedSprintAction?.sprintId, payload)
          }
        />
      ) : null}
    </>
  );
};
