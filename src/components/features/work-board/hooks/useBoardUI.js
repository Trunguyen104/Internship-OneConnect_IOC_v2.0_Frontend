'use client';

import { useState } from 'react';

/**
 * Hook for Board UI states
 */
export function useBoardUI() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [openUpdateTask, setOpenUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  return {
    query,
    setQuery,
    activeId,
    setActiveId,
    openUpdateTask,
    setOpenUpdateTask,
    selectedTask,
    setSelectedTask,
  };
}
