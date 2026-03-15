import { useState } from 'react';

/**
 * Hook for Backlog Sidebar and Modal visibility states
 */
export function useBacklogUI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal State
  const [openCreateEpic, setOpenCreateEpic] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openUpdateTask, setOpenUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openStartSprint, setOpenStartSprint] = useState(false);
  const [openCompleteSprint, setOpenCompleteSprint] = useState(false);
  const [selectedSprintAction, setSelectedSprintAction] = useState(null);
  const [openCreateSprint, setOpenCreateSprint] = useState(false);

  // Local state for specific actions
  const [activeSprintForTask, setActiveSprintForTask] = useState(null);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    openCreateEpic,
    setOpenCreateEpic,
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
    openCreateSprint,
    setOpenCreateSprint,
    activeSprintForTask,
    setActiveSprintForTask,
  };
}
